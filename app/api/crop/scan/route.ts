import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "কোনো ছবি পাওয়া যায়নি" }, { status: 400 });
    }

    //  Get Nyckel Access Token
    const tokenRes = await fetch("https://www.nyckel.com/connect/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.NYCKEL_CLIENT_ID!,
        client_secret: process.env.NYCKEL_CLIENT_SECRET!,
      }),
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    //  Prepare multipart/form-data for Nyckel
    const nyckelForm = new FormData();
    nyckelForm.append("data", file, file.name);

    //  Invoke Nyckel Function
    const nyckelRes = await fetch(
      `https://www.nyckel.com/v1/functions/${process.env.NYCKEL_FUNCTION_ID}/invoke`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: nyckelForm,
      }
    );

    const result = await nyckelRes.json();

    //  Read labelName instead of label
    const rawLabel = (result.labelName || "").toLowerCase();
    const label =
      rawLabel.includes("fresh") ? "তাজা" :
      rawLabel.includes("stale") ? "পচা" :
      "অজানা";

    //  Confidence
    let confidence = Number(result.confidence || 0);
    if (confidence <= 1) confidence = confidence * 100;

    return NextResponse.json({ label, confidence });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "সার্ভার এ সমস্যা", details: err }, { status: 500 });
  }
}
