/**
 * OpenAI server-side configuration.
 * Never import this module from client components.
 */

export function getOpenAIApiKey() {
  return process.env.OPENAI_API_KEY?.trim() ?? "";
}

export function isOpenAIConfigured() {
  return Boolean(getOpenAIApiKey());
}

export function getOpenAIModel() {
  return process.env.OPENAI_MODEL?.trim() || "gpt-4o";
}

export function shouldUseScholarDnaMockFallback() {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.SCHOLAR_DNA_MOCK_FALLBACK === "true"
  );
}
