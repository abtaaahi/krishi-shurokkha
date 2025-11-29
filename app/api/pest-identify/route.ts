import { NextResponse } from "next/server";
import { GoogleGenerativeAI, Part } from "@google/generative-ai";

// Server-side Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const GEMINI_MODEL = "gemini-2.0-flash";

export async function POST(req: Request) {
  console.log("POST /api/pest-identify called");

  try {
    const { imageBase64 } = await req.json();
    console.log("Received imageBase64:", !!imageBase64);

    if (!imageBase64) {
      return NextResponse.json({ error: "কোনো ছবি আপলোড করা হয়নি" });
    }

    const prompt = `
আপনি বাংলাদেশের কৃষি বিশেষজ্ঞ। 
আপনাকে দেওয়া ছবির ভিত্তিতে পোকা বা ক্ষতির ধরন নির্ণয় করুন। 
আপনার আউটপুট অবশ্যই বাংলায় হবে এবং নিচের বিভাগগুলো থাকবে:
1. পোকা/রোগের নাম
2. ঝুঁকির মাত্রা (উচ্চ / মাঝারি / নিম্ন)
3. আক্রান্ত হওয়ার কারণ
4. চেনার লক্ষণ
5. ক্ষতির পরিমাণ
6. স্থানীয় কৃষকের জন্য বাস্তবসম্মত চিকিৎসা পরিকল্পনা
7. প্রতিরোধের উপায়
কোনো অবস্থাতেই ইংরেজি শব্দ ব্যবহার করবেন না।
`;

    // Prepare multimodal input
    const content: Part[] = [
      { text: prompt },
      { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
    ];

    // Call Gemini generateContent
    const result = await genAI.getGenerativeModel({ model: GEMINI_MODEL }).generateContent(content);

    const resultText = result.response?.text() || "কোনো ফলাফল পাওয়া যায়নি। অনুগ্রহ করে পরে চেষ্টা করুন।";

    console.log("Gemini response:", resultText);

    return NextResponse.json({ result: resultText });
  } catch (err) {
    console.error("ERROR in /api/pest-identify:", err);
    return NextResponse.json({
      result: "কোনো ফলাফল পাওয়া যায়নি। অনুগ্রহ করে পরে চেষ্টা করুন।",
    });
  }
}