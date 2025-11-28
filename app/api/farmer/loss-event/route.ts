import { NextResponse } from "next/server";
import { createServer } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const supabase = await createServer();
    const { batch_id, loss_type, loss_amount, description, event_date } = await req.json();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "User not authenticated" }, { status: 401 });

    const { data, error } = await supabase
      .from("loss_events")
      .insert([{ farmer_id: user.id, batch_id, loss_type, loss_amount, description, event_date }])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabase.rpc("update_farmer_badges", { farmer_uuid: user.id });

    return NextResponse.json({ message: "Loss event added successfully", lossEvent: data });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
