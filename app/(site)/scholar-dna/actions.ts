"use server";

import { redirect } from "next/navigation";
import { createScholarDnaAnalysis } from "@/lib/scholar-dna";
import type { ScholarDnaActionState } from "@/lib/scholar-dna-action-state";

export async function submitScholarDnaAnalysis(
  _prevState: ScholarDnaActionState,
  formData: FormData,
): Promise<ScholarDnaActionState> {
  const result = await createScholarDnaAnalysis({
    name: String(formData.get("name") ?? ""),
    affiliation: String(formData.get("affiliation") ?? ""),
    fieldOfStudy: String(formData.get("field_of_study") ?? ""),
    paperTitle1: String(formData.get("paper_title_1") ?? ""),
    paperTitle2: String(formData.get("paper_title_2") ?? ""),
    paperTitle3: String(formData.get("paper_title_3") ?? ""),
    recentInterest: String(formData.get("recent_interest") ?? ""),
  });

  if (!result.ok) {
    return {
      status: "error",
      message: result.error,
      fieldErrors: result.fieldErrors,
    };
  }

  redirect(`/scholar-dna/${result.id}`);
}
