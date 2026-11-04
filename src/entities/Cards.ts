export type Priority = "low" | "medium" | "high";

export interface Card {
  id: string;
  column_id: string;
  title: string;
  description: string | null;
  priority: Priority | null;
  position: number;
  created_at: string;
}
