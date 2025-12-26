import { supabase } from "@/lib/supabase";

export async function POST() {
  await supabase.from("buzz_queue").delete().neq("id", 0);
  return Response.json({ success: true });
}
