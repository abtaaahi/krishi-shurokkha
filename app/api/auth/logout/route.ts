import { NextResponse } from "next/server";
import { createServer } from "@/lib/supabase-server";

export async function POST() {
  try {
    const supabase = await createServer();
    await supabase.auth.signOut();
    return NextResponse.json({ message: "Logged out successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
