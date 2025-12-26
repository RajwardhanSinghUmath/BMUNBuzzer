import { supabase } from "@/lib/supabase";

export async function POST(request) {
  const { userId } = await request.json();

  await supabase.from("buzz_queue").delete().eq("user_id", userId);

  return Response.json({ success: true });
}
