"use client";

import type { FormHTMLAttributes, ReactNode, SubmitEvent } from "react";
import { trackGaEvent } from "@/lib/analytics";

type SearchFormProps = FormHTMLAttributes<HTMLFormElement> & {
  children: ReactNode;
};

export function SearchForm({ children, onSubmit, ...props }: SearchFormProps) {
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    const query = String(new FormData(event.currentTarget).get("q") ?? "").trim();

    if (query) {
      trackGaEvent("search_used");
    }

    onSubmit?.(event);
  }

  return (
    <form {...props} onSubmit={handleSubmit}>
      {children}
    </form>
  );
}
