import { NextResponse } from "next/server";
import { createServer } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const supabase = await createServer();
    const { batch_id, action_type, action_date, outcome, success_score, notes } = await req.json();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "User not authenticated" }, { status: 401 });

    const { data, error } = await supabase
      .from("interventions")
      .insert([{ farmer_id: user.id, batch_id, action_type, action_date, outcome, success_score, notes }])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabase.rpc("update_farmer_badges", { farmer_uuid: user.id });

    return NextResponse.json({ message: "Intervention added successfully", intervention: data });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
