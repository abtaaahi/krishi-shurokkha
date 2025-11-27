// lib/redirectIfAuthenticated.ts
import { createServer } from "./supabase-server";
import { redirect } from "next/navigation";

export async function redirectIfAuthenticated() {
  const supabase = await createServer();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect("/farmer/dashboard");
  }
}
