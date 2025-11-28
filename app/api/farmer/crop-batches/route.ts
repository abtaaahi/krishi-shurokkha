import { NextResponse } from "next/server";
import { createServer } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const supabase = await createServer();

  // Get authenticated user securely
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    return NextResponse.json(
      { error: "আপনি লগইন করেননি। অনুগ্রহ করে আগে লগইন করুন।" },
      { status: 401 }
    );
  }

  const user = userData.user;
  const body = await req.json();
  const { crop_type, estimated_weight, harvest_date, storage_division, storage_district, storage_type } = body;

  // Check farmer record
  const { data: farmer, error: farmerError } = await supabase
    .from("farmers")
    .select("id, is_verified")
    .eq("id", user.id)
    .single();

  if (farmerError || !farmer) {
    return NextResponse.json(
      { error: "কৃষক খুঁজে পাওয়া যায়নি।" },
      { status: 404 }
    );
  }

  if (!farmer.is_verified) {
    return NextResponse.json(
      { error: "আপনার কৃষক প্রোফাইল যাচাই হয়নি। অনুগ্রহ করে প্রশাসকের অনুমোদনের অপেক্ষা করুন।" },
      { status: 403 }
    );
  }

  // Insert crop batch
  const { error } = await supabase
    .from("crop_batches")
    .insert({
      farmer_id: user.id,
      crop_type,
      estimated_weight,
      harvest_date,
      storage_division,
      storage_district,
      storage_type,
    });

  if (error) {
    // Log the full Supabase error object for debugging
    console.error("Supabase insert error:", error);

    return NextResponse.json(
      { error: `ফসলের ব্যাচ রেজিস্টার করতে ব্যর্থ হয়েছে। বিস্তারিত: ${error.message}` },
      { status: 400 }
    );
  }

  return NextResponse.json({ message: "ফসলের ব্যাচ সফলভাবে রেজিস্টার হয়েছে!" });
}


export async function GET(req: Request) {
  const supabase = await createServer();

  // Get authenticated user securely
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    return NextResponse.json(
      { error: "আপনি লগইন করেননি। অনুগ্রহ করে আগে লগইন করুন।" },
      { status: 401 }
    );
  }

  const user = userData.user;

  // Fetch crop batches for this farmer
  const { data: batches, error } = await supabase
    .from("crop_batches")
    .select("*")
    .eq("farmer_id", user.id);

  if (error) {
    return NextResponse.json(
      { error: "ফসলের ব্যাচ লোড করতে ব্যর্থ হয়েছে।" },
      { status: 400 }
    );
  }

  return NextResponse.json({ batches });
}