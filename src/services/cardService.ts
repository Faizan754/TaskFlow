import { type Card } from "../entities/Cards";
import { supabase } from "../lib/supabaseClient";

export async function getCards(columnIds: string[]): Promise<Card[]> {
  if (columnIds.length === 0) {
    return [];
  }
  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .in("column_id", columnIds)
    .order("position");
  if (error) {
    throw error;
  }
  return data;
}
