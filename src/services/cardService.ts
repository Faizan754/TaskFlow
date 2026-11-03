import { type Card } from "../entities/Cards";
import { supabase } from "../lib/supabaseClient";

interface CreateCardInput {
  columnId: string;
  title: string;
  description?: string;
  position: number;
}

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

export async function createCard({
  columnId,
  title,
  description,
  position,
}: CreateCardInput): Promise<Card> {
  const { data, error } = await supabase
    .from("cards")
    .insert({
      column_id: columnId,
      title,
      description: description || null,
      position,
    })
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
}
