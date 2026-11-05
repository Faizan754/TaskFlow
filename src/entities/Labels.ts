import type { LabelColor } from "../lib/labelColors";

export interface Label {
  id: string;
  board_id: string;
  name: string;
  color: LabelColor;
  created_at: string;
}

export interface CardLabel {
  card_id: string;
  label_id: string;
}
