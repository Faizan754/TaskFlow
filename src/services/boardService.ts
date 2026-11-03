import { supabase } from "../lib/supabaseClient";
import { type Board } from "../entities/Boards";

interface CreateBoard {
  userId: string;
  title: string;
}

export async function getBoards(): Promise<Board[]> {
  const { data, error } = await supabase.from("boards").select("*");
  if (error) {
    throw error;
  }
  return data;
}

export async function getBoard(boardId: string): Promise<Board | null> {
  const { data, error } = await supabase
    .from("boards")
    .select("*")
    .eq("id", boardId)
    .maybeSingle();
  if (error) {
    throw error;
  }
  return data;
}

export async function createBoard({
  userId,
  title,
}: CreateBoard): Promise<Board> {
  const { data, error } = await supabase
    .from("boards")
    .insert({
      user_id: userId,
      title: title,
    })
    .select();
  if (error) {
    throw error;
  }
  const board = data[0];
  const { error: columnsError } = await supabase.from("columns").insert([
    { board_id: board.id, title: "To Do", position: 0 },
    { board_id: board.id, title: "In Progress", position: 1 },
    { board_id: board.id, title: "Done", position: 2 },
  ]);
  if (columnsError) {
    throw columnsError;
  }
  return board;
}
