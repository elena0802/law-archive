/**
 * Dev-only: compare mock (old-style summary) vs GPT (new prompts).
 * Usage: npx tsx --env-file=.env.local scripts/scholar-dna-quality-sample.ts
 */

import { generateScholarDnaResult } from "../lib/scholar-dna/generation-pipeline";
import { generateMockScholarDnaResult } from "../lib/scholar-dna-mock";
import type { ScholarDnaGenerateInput } from "../lib/scholar-dna/types";

const SAMPLES: Array<{ label: string; input: ScholarDnaGenerateInput }> = [
  {
    label: "민법 · 계약·책임",
    input: {
      name: "이철수",
      affiliation: "○○대학교 법학전문대학원 교수",
      fieldOfStudy: "민법",
      paperTitles: [
        "계약 자유의 한계와 강행규정",
        "불법행위법상 책임 구조의 재검토",
        "민법 총칙의 현대적 해석",
      ],
      recentInterest: "디지털 계약과 법",
    },
  },
  {
    label: "형사법 · 정책·절차",
    input: {
      name: "박민정",
      affiliation: "△△대학교 법학과 교수",
      fieldOfStudy: "형사법",
      paperTitles: [
        "양형의 정당성과 형사정책",
        "디지털 증거의 증명력",
        "피해자 참여와 형사절차",
      ],
      recentInterest: "AI 수사와 인권",
    },
  },
  {
    label: "비교법 · EU",
    input: {
      name: "김서연",
      affiliation: "□□대학교 법학전문대학원 교수",
      fieldOfStudy: "비교법",
      paperTitles: [
        "EU법과 국내법의 조화",
        "비교법 방법론의 전통과 변화",
        "국제사법의 새로운 과제",
      ],
      recentInterest: null,
    },
  },
];

function printResult(label: string, result: {
  scholarAlias: string;
  academicLifeStory: string;
  aiOneLiner: string;
}) {
  console.log(`\n--- ${label} ---`);
  console.log(`별칭: ${result.scholarAlias}`);
  console.log(`\n학문 인생 (${result.academicLifeStory.length}자):\n${result.academicLifeStory}`);
  console.log(`\nAI 한 문장: ${result.aiOneLiner}`);
}

async function main() {
  for (const sample of SAMPLES) {
    console.log("\n" + "=".repeat(60));
    console.log(`샘플: ${sample.label}`);
    console.log("=".repeat(60));

    const oldResult = generateMockScholarDnaResult({
      name: sample.input.name,
      affiliation: sample.input.affiliation,
      fieldOfStudy: sample.input.fieldOfStudy,
      paperTitles: sample.input.paperTitles,
      recentInterest: sample.input.recentInterest,
    });

    printResult("이전 (mock — 논문 요약형)", oldResult);

    const newResult = await generateScholarDnaResult(sample.input);
    printResult("개선 (GPT — PR52.2.1)", newResult);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
