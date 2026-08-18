import { supabase } from "../lib/supabaseClient";

export interface Board {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
}

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
  return data[0];
}
