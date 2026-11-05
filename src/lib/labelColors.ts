export const LABEL_COLORS = [
  "gray",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
] as const;

export type LabelColor = (typeof LABEL_COLORS)[number];

export const labelColorClasses: Record<
  LabelColor,
  { chip: string; swatch: string }
> = {
  gray: { chip: "bg-gray-200 text-gray-800", swatch: "bg-gray-400" },
  red: { chip: "bg-red-100 text-red-800", swatch: "bg-red-500" },
  orange: { chip: "bg-orange-100 text-orange-800", swatch: "bg-orange-500" },
  yellow: { chip: "bg-yellow-100 text-yellow-800", swatch: "bg-yellow-400" },
  green: { chip: "bg-green-100 text-green-800", swatch: "bg-green-500" },
  blue: { chip: "bg-blue-100 text-blue-800", swatch: "bg-blue-500" },
  purple: { chip: "bg-purple-100 text-purple-800", swatch: "bg-purple-500" },
  pink: { chip: "bg-pink-100 text-pink-800", swatch: "bg-pink-500" },
};
