import { supabase } from "../lib/supabaseClient";
import { type Column } from "../entities/Columns";

export async function getColumns(boardId: string): Promise<Column[]> {
  const { data, error } = await supabase
    .from("columns")
    .select("*")
    .eq("board_id", boardId)
    .order("position");

  if (error) {
    throw error;
  }
  return data;
}
