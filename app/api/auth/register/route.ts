// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { createServer } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const supabase = await createServer();

  try {
    const { email, password, phone, name, preferred_language } =
      await req.json();

    if (!email || !password || !phone || !name) {
      return NextResponse.json(
        { error: "সব ঘর পূরণ করতে হবে" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" },
        { status: 400 }
      );
    }

    // Create Supabase Auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json(
        { error: "ইমেইল ইতিমধ্যে নিবন্ধিত অথবা ভুল হয়েছে" },
        { status: 400 }
      );
    }

    const userId = authData.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: "রেজিস্ট্রেশন সম্পন্ন হয়নি। পরে চেষ্টা করুন।" },
        { status: 500 }
      );
    }

    // Insert into farmers table
    const { error: profileError } = await supabase.from("farmers").insert({
      id: userId,
      name,
      phone,
      preferred_language: preferred_language || "bn",
    });

    if (profileError) {
      return NextResponse.json(
        { error: "প্রোফাইল তৈরি করতে সমস্যা হয়েছে" },
        { status: 500 }
      );
    }

    // Cookies automatically set by supabase
    return NextResponse.json({ message: "রেজিস্ট্রেশন সফল হয়েছে!" });
  } catch (err) {
    return NextResponse.json(
      { error: "সার্ভারে একটি সমস্যা হয়েছে" },
      { status: 500 }
    );
  }
}
