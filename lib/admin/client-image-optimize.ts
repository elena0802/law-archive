export const CLIENT_IMAGE_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type ClientImageAcceptedType = (typeof CLIENT_IMAGE_ACCEPTED_TYPES)[number];

export const CLIENT_IMAGE_MAX_WIDTH = 1600;
export const CLIENT_IMAGE_WEBP_QUALITY = 0.82;
export const CLIENT_IMAGE_TARGET_MAX_BYTES = Math.round(1.2 * 1024 * 1024);
export const CLIENT_IMAGE_MIN_QUALITY = 0.5;
export const CLIENT_UPLOAD_TIMEOUT_MS = 60_000;

export type ClientImageOptimizeOptions = {
  maxWidth?: number;
  quality?: number;
  targetMaxBytes?: number;
};

export type ClientImageOptimizeResult =
  | { ok: true; file: File }
  | { ok: false; message: string };

export function validateClientImageFile(
  file: File,
): ClientImageOptimizeResult | { ok: true } {
  if (
    !CLIENT_IMAGE_ACCEPTED_TYPES.includes(file.type as ClientImageAcceptedType)
  ) {
    return {
      ok: false,
      message: "JPEG, PNG, WebP 이미지만 업로드할 수 있습니다.",
    };
  }

  return { ok: true };
}

function replaceExtension(filename: string, extension: string) {
  const base = filename.split(/[/\\]/).pop() ?? "image";
  const stem = base.replace(/\.[a-zA-Z0-9]+$/, "") || "image";
  return `${stem}.${extension}`;
}

async function loadImageSource(file: File): Promise<CanvasImageSource> {
  if (typeof createImageBitmap === "function") {
    return createImageBitmap(file);
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("image load failed"));
      element.src = objectUrl;
    });

    return image;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function releaseImageSource(source: CanvasImageSource) {
  if (source instanceof ImageBitmap) {
    source.close();
  }
}

function readSourceSize(source: CanvasImageSource) {
  if (source instanceof ImageBitmap) {
    return { width: source.width, height: source.height };
  }

  if (source instanceof HTMLImageElement) {
    return { width: source.naturalWidth, height: source.naturalHeight };
  }

  if (source instanceof HTMLCanvasElement) {
    return { width: source.width, height: source.height };
  }

  return { width: 0, height: 0 };
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

async function encodeCanvasImage(
  canvas: HTMLCanvasElement,
  baseQuality: number,
  targetMaxBytes: number,
) {
  const attempts: Array<{ type: string; quality: number; extension: string }> =
    [];

  for (let quality = baseQuality; quality >= CLIENT_IMAGE_MIN_QUALITY; quality -= 0.08) {
    attempts.push({ type: "image/webp", quality, extension: "webp" });
  }

  for (let quality = baseQuality; quality >= CLIENT_IMAGE_MIN_QUALITY; quality -= 0.08) {
    attempts.push({ type: "image/jpeg", quality, extension: "jpg" });
  }

  let smallest: { blob: Blob; extension: string } | null = null;

  for (const attempt of attempts) {
    const blob = await canvasToBlob(canvas, attempt.type, attempt.quality);
    if (!blob) {
      continue;
    }

    if (blob.size <= targetMaxBytes) {
      return { blob, extension: attempt.extension };
    }

    if (!smallest || blob.size < smallest.blob.size) {
      smallest = { blob, extension: attempt.extension };
    }
  }

  return smallest;
}

/**
 * Resize and compress an image in the browser before admin upload.
 * Reusable for essay and (later) news cover uploads.
 */
export async function optimizeClientImageFile(
  file: File,
  options: ClientImageOptimizeOptions = {},
): Promise<ClientImageOptimizeResult> {
  const validation = validateClientImageFile(file);
  if (!validation.ok) {
    return validation;
  }

  const maxWidth = options.maxWidth ?? CLIENT_IMAGE_MAX_WIDTH;
  const baseQuality = options.quality ?? CLIENT_IMAGE_WEBP_QUALITY;
  const targetMaxBytes = options.targetMaxBytes ?? CLIENT_IMAGE_TARGET_MAX_BYTES;

  let source: CanvasImageSource | null = null;

  try {
    source = await loadImageSource(file);
    const { width: sourceWidth, height: sourceHeight } = readSourceSize(source);

    if (sourceWidth <= 0 || sourceHeight <= 0) {
      return {
        ok: false,
        message: "이미지 크기를 확인할 수 없습니다. 다른 파일을 선택해 주세요.",
      };
    }

    const scale = Math.min(1, maxWidth / sourceWidth);
    const width = Math.max(1, Math.round(sourceWidth * scale));
    const height = Math.max(1, Math.round(sourceHeight * scale));

    if (
      scale === 1 &&
      file.size <= targetMaxBytes &&
      file.type === "image/webp"
    ) {
      return { ok: true, file };
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      return {
        ok: false,
        message: "이미지를 준비하지 못했습니다. 브라우저를 새로고침한 뒤 다시 시도해 주세요.",
      };
    }

    context.drawImage(source, 0, 0, width, height);

    const encoded = await encodeCanvasImage(canvas, baseQuality, targetMaxBytes);
    if (!encoded) {
      return {
        ok: false,
        message: "이미지를 압축하지 못했습니다. 다른 파일을 선택해 주세요.",
      };
    }

    const optimizedFile = new File(
      [encoded.blob],
      replaceExtension(file.name, encoded.extension),
      { type: encoded.blob.type },
    );

    return { ok: true, file: optimizedFile };
  } catch (error) {
    console.error("[optimizeClientImageFile] failed", { error });
    return {
      ok: false,
      message: "이미지를 준비하지 못했습니다. 다시 시도해 주세요.",
    };
  } finally {
    if (source) {
      releaseImageSource(source);
    }
  }
}

export async function withClientUploadTimeout<T>(
  promise: Promise<T>,
  timeoutMs = CLIENT_UPLOAD_TIMEOUT_MS,
  timeoutMessage = "업로드 시간이 초과되었습니다. 다시 시도해 주세요.",
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error(timeoutMessage));
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}
