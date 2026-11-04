import { supabase } from "../lib/supabaseClient";
import { type Column } from "../entities/Columns";

interface CreateColumnInput {
  boardId: string;
  title: string;
  position: number;
}

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

export async function createColumn({
  boardId,
  title,
  position,
}: CreateColumnInput): Promise<Column> {
  const { data, error } = await supabase
    .from("columns")
    .insert({ board_id: boardId, title, position })
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
}

export async function renameColumn(id: string, title: string): Promise<Column> {
  const { data, error } = await supabase
    .from("columns")
    .update({ title })
    .eq("id", id)
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
}

export async function deleteColumn(id: string): Promise<void> {
  const { data, error } = await supabase
    .from("columns")
    .delete()
    .eq("id", id)
    .select("id");
  if (error) {
    throw error;
  }
  if (data.length === 0) {
    throw new Error("Column not found or not allowed to delete it");
  }
}
