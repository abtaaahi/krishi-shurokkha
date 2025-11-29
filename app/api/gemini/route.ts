// app/api/gemini/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ reply: "প্রম্পট খালি।" }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",        // or another valid model name
      contents: prompt
    });

    const reply = result.text;  // .text contains the response string

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("GenAI error:", err);
    return NextResponse.json({ reply: "সার্ভারে সমস্যা হয়েছে।" }, { status: 500 });
  }
}
