import { supabase } from "@/lib/supabase";

export async function POST(request) {
  const { userId, name } = await request.json();

  // check if user already pressed
  const { data: exists } = await supabase
    .from("buzz_queue")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (exists) {
    return Response.json({
      success: false,
      message: "User already pressed!"
    });
  }

  const { error } = await supabase
    .from("buzz_queue")
    .insert({
      user_id: userId,
      name,
      timestamp: Date.now()
    });

  if (error) {
    return Response.json({ success: false, error });
  }

  return Response.json({ success: true });
}
