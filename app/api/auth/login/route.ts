// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { createServer } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const supabase = await createServer();
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "ইমেইল এবং পাসওয়ার্ড অবশ্যই দিতে হবে।" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json(
      { error: "ইমেইল বা পাসওয়ার্ড ভুল।" },
      { status: 401 }
    );
  }

  // Cookies are automatically set by Supabase
  return NextResponse.json({ message: "সফল লগইন" });
}
