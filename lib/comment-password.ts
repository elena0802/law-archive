import { createHash, timingSafeEqual } from "crypto";

const DEV_FALLBACK_SECRET = "criminal-law-archive-comment-password-dev";

export function getCommentPasswordSecret() {
  const secret = process.env.COMMENT_PASSWORD_SECRET?.trim();
  return secret || DEV_FALLBACK_SECRET;
}

export function hashCommentPassword(password: string) {
  return createHash("sha256")
    .update(`${getCommentPasswordSecret()}:${password}`)
    .digest("hex");
}

export function verifyCommentPassword(
  password: string,
  passwordHash: string | null,
) {
  if (!passwordHash) {
    return false;
  }

  const digest = hashCommentPassword(password);

  if (digest.length !== passwordHash.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(digest), Buffer.from(passwordHash));
}
