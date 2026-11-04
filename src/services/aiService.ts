import { supabase } from "../lib/supabaseClient";

export type LlmProvider = "gemini" | "groq";

interface SuggestSubtasksInput {
  title: string;
  description: string | null;
  provider: LlmProvider;
}

export async function suggestSubtasks({
  title,
  description,
  provider,
}: SuggestSubtasksInput): Promise<string[]> {
  const { data, error } = await supabase.functions.invoke("suggest-subtasks", {
    body: { title, description: description ?? "", provider },
  });
  if (error) {
    throw error;
  }
  if (!data || !Array.isArray(data.subtasks)) {
    throw new Error("Unexpected response from suggest-subtasks");
  }
  return data.subtasks as string[];
}
