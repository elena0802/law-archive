"use server";

import { revalidatePath } from "next/cache";

export async function revalidatePublicNewsPaths() {
  revalidatePath("/");
  revalidatePath("/news");
}
