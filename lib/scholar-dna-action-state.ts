export type ScholarDnaFieldErrors = {
  name?: string;
  affiliation?: string;
  fieldOfStudy?: string;
  paperTitle1?: string;
  paperTitle2?: string;
  paperTitle3?: string;
  recentInterest?: string;
};

export type ScholarDnaActionState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: ScholarDnaFieldErrors;
};

export const scholarDnaActionIdleState: ScholarDnaActionState = {
  status: "idle",
};
