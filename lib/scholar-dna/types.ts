import type { ScholarDnaTraitRow } from "@/lib/content/db-types";

export type ScholarDnaGenerateInput = {
  name: string;
  affiliation: string;
  fieldOfStudy: string;
  paperTitles: string[];
  recentInterest: string | null;
};

export type ScholarDnaInterestMapItem = {
  label: string;
  value: number;
};

export type ScholarDnaResearchAnalysis = {
  centralQuestion: string;
  startingPoint: string;
  development: string;
  tension: string;
  keywords: string[];
  scholarAlias: string;
  interestMap: ScholarDnaInterestMapItem[];
  legacyMeaning: string;
};

export type ScholarDnaGeneratedResult = {
  scholarAlias: string;
  academicLifeStory: string;
  keywords: string[];
  scholarDna: ScholarDnaTraitRow[];
  aiOneLiner: string;
};

export type ScholarDnaGptResultJson = {
  scholarAlias: string;
  academicLifeStory: string;
  keywords: string[];
  interestMap: ScholarDnaInterestMapItem[];
  aiOneLiner: string;
};
