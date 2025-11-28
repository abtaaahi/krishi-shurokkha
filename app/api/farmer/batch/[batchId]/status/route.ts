import { NextResponse } from "next/server";
import { createServer } from "@/lib/supabase-server";

export async function PUT(req: Request, context: any) {
  try {
    const params = await context.params;
    const batchId = params.batchId;

    const supabase = await createServer();

    // Authenticate user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      return NextResponse.json(
        { error: "আপনি লগইন করেননি। অনুগ্রহ করে আগে লগইন করুন।" },
        { status: 401 }
      );
    }

    const user = userData.user;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "স্ট্যাটাস প্রদান করা প্রয়োজন।" },
        { status: 400 }
      );
    }

    // Validate batch ownership
    const { data: batch, error: batchError } = await supabase
      .from("crop_batches")
      .select("id, farmer_id")
      .eq("id", batchId)
      .single();

    if (batchError || !batch) {
      return NextResponse.json(
        { error: "ব্যাচ খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    if (batch.farmer_id !== user.id) {
      return NextResponse.json(
        { error: "আপনি এই ব্যাচ পরিবর্তন করার অনুমতি নেই।" },
        { status: 403 }
      );
    }

    // Update status
    const { error: updateError } = await supabase
      .from("crop_batches")
      .update({ status })
      .eq("id", batchId);

    if (updateError) {
      console.error(updateError);
      return NextResponse.json(
        { error: "স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "ব্যাচ স্ট্যাটাস সফলভাবে আপডেট হয়েছে!",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "সার্ভারে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
