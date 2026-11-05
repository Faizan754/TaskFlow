import { supabase } from "../lib/supabaseClient";
import type { CardLabel, Label } from "../entities/Labels";
import type { LabelColor } from "../lib/labelColors";

interface CreateLabelInput {
  boardId: string;
  name: string;
  color: LabelColor;
}

export async function getLabels(boardId: string): Promise<Label[]> {
  const { data, error } = await supabase
    .from("labels")
    .select("*")
    .eq("board_id", boardId)
    .order("created_at");
  if (error) {
    throw error;
  }
  return data;
}

export async function createLabel({
  boardId,
  name,
  color,
}: CreateLabelInput): Promise<Label> {
  const { data, error } = await supabase
    .from("labels")
    .insert({ board_id: boardId, name, color })
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
}

export async function deleteLabel(id: string): Promise<void> {
  const { data, error } = await supabase
    .from("labels")
    .delete()
    .eq("id", id)
    .select("id");
  if (error) {
    throw error;
  }
  if (data.length === 0) {
    throw new Error("Label not found or not allowed to delete it");
  }
}

export async function getCardLabels(labelIds: string[]): Promise<CardLabel[]> {
  if (labelIds.length === 0) {
    return [];
  }
  const { data, error } = await supabase
    .from("card_labels")
    .select("*")
    .in("label_id", labelIds);
  if (error) {
    throw error;
  }
  return data;
}

export async function addCardLabel(
  cardId: string,
  labelId: string,
): Promise<CardLabel> {
  const { data, error } = await supabase
    .from("card_labels")
    .insert({ card_id: cardId, label_id: labelId })
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
}

export async function removeCardLabel(
  cardId: string,
  labelId: string,
): Promise<void> {
  const { data, error } = await supabase
    .from("card_labels")
    .delete()
    .eq("card_id", cardId)
    .eq("label_id", labelId)
    .select("card_id");
  if (error) {
    throw error;
  }
  if (data.length === 0) {
    throw new Error("Card label not found or not allowed to remove it");
  }
}
