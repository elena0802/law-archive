import { compileMDX } from "next-mdx-remote/rsc";
import { prepareEssayMdxSource } from "@/lib/content/prepare-essay-mdx";

type EssayProseFallbackProps = {
  content: string;
};

function EssayProseFallback({ content }: EssayProseFallbackProps) {
  const paragraphs = content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <p className="text-keep" key={index}>
          {paragraph}
        </p>
      ))}
    </>
  );
}

type EssayMdxContentProps = {
  content: string;
};

export async function EssayMdxContent({ content }: EssayMdxContentProps) {
  const normalizedContent = content ?? "";
  const source = prepareEssayMdxSource(normalizedContent);

  try {
    const { content: compiled } = await compileMDX({ source });
    return compiled;
  } catch (error) {
    console.error("[EssayMdxContent] MDX compile failed", { error });
    return <EssayProseFallback content={normalizedContent} />;
  }
}
