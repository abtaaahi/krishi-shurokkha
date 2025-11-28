import { NextResponse } from "next/server";
import { createServer } from "@/lib/supabase-server";

// Fetch full profile data
export async function GET(req: Request) {
  try {
    const supabase = await createServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    // Fetch farmer profile
    const { data: profile } = await supabase
      .from("farmers")
      .select("name, phone, preferred_language")
      .eq("id", user.id)
      .single();

    // Fetch crop batches
    const { data: batches } = await supabase
      .from("crop_batches")
      .select("*")
      .eq("farmer_id", user.id);

    // Fetch interventions
    const { data: interventions } = await supabase
      .from("interventions")
      .select("*")
      .eq("farmer_id", user.id);

    // Compute success rate per batch
    const successByBatch = interventions?.reduce((acc: any, i) => {
      if (!acc[i.batch_id]) acc[i.batch_id] = { total: 0, success: 0 };
      acc[i.batch_id].total += 1;
      acc[i.batch_id].success += i.success_score || 0;
      return acc;
    }, {});

    // Fetch loss events
    const { data: lossEvents } = await supabase
      .from("loss_events")
      .select("*")
      .eq("farmer_id", user.id);

    // Fetch earned badges
    const { data: earnedBadges } = await supabase
      .from("farmer_badges")
      .select(`
        badges(id, code, title, description, icon),
        earned_at
      `)
      .eq("farmer_id", user.id);

    return NextResponse.json({
      profile,
      batches,
      interventions,
      successByBatch,
      lossEvents,
      earnedBadges,
    });
  } catch (err) {
    return NextResponse.json({ error: "সার্ভারে সমস্যা হয়েছে" }, { status: 500 });
  }
}

// Update farmer profile (existing PUT)
export async function PUT(req: Request) {
  try {
    const supabase = await createServer();
    const { name, phone, language } = await req.json();

    if (!name || !phone || !language) {
      return NextResponse.json({ error: "সব ঘর পূরণ করতে হবে" }, { status: 400 });
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const { error } = await supabase
      .from("farmers")
      .update({ name, phone, preferred_language: language })
      .eq("id", user.id);

    if (error) {
      return NextResponse.json({ error: "প্রোফাইল আপডেট করতে সমস্যা হয়েছে" }, { status: 500 });
    }

    return NextResponse.json({ message: "প্রোফাইল সফলভাবে আপডেট হয়েছে!" });
  } catch (err) {
    return NextResponse.json({ error: "সার্ভারে সমস্যা হয়েছে" }, { status: 500 });
  }
}
