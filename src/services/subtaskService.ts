import { supabase } from "../lib/supabaseClient";
import type { Subtask } from "../entities/Subtasks";

interface CreateSubtaskInput {
  cardId: string;
  title: string;
  position: number;
}

export async function getSubtasks(cardId: string): Promise<Subtask[]> {
  const { data, error } = await supabase
    .from("subtasks")
    .select("*")
    .eq("card_id", cardId)
    .order("position");
  if (error) {
    throw error;
  }
  return data;
}

export async function createSubtask({
  cardId,
  title,
  position,
}: CreateSubtaskInput): Promise<Subtask> {
  const { data, error } = await supabase
    .from("subtasks")
    .insert({ card_id: cardId, title, position })
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
}

export async function toggleSubtask(
  id: string,
  isDone: boolean,
): Promise<Subtask> {
  const { data, error } = await supabase
    .from("subtasks")
    .update({ is_done: isDone })
    .eq("id", id)
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
}

export async function deleteSubtask(id: string): Promise<void> {
  const { error } = await supabase.from("subtasks").delete().eq("id", id);
  if (error) {
    throw error;
  }
}
