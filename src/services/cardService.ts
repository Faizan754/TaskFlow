import type { Card, Priority } from "../entities/Cards";
import { supabase } from "../lib/supabaseClient";

interface CreateCardInput {
  columnId: string;
  title: string;
  description?: string;
  position: number;
}

interface UpdateCardInput {
  id: string;
  title: string;
  description: string;
  priority: Priority | null;
}

interface MoveCardInput {
  cardId: string;
  targetColumnId: string;
  targetIndex: number;
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

export async function updateCard({
  id,
  title,
  description,
  priority,
}: UpdateCardInput): Promise<Card> {
  const { data, error } = await supabase
    .from("cards")
    .update({ title, description: description || null, priority })
    .eq("id", id)
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
}

export async function deleteCard(id: string): Promise<void> {
  const { error } = await supabase.from("cards").delete().eq("id", id);
  if (error) {
    throw error;
  }
}

export async function moveCard({
  cardId,
  targetColumnId,
  targetIndex,
}: MoveCardInput): Promise<void> {
  const { error } = await supabase.rpc("move_card", {
    p_card_id: cardId,
    p_target_column_id: targetColumnId,
    p_target_index: targetIndex,
  });
  if (error) {
    throw error;
  }
}
