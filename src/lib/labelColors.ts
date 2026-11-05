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
  gray: {
    chip: "bg-[var(--l-gray-bg)] text-[var(--l-gray-fg)]",
    swatch: "bg-[var(--sw-gray)]",
  },
  red: {
    chip: "bg-[var(--l-red-bg)] text-[var(--l-red-fg)]",
    swatch: "bg-[var(--sw-red)]",
  },
  orange: {
    chip: "bg-[var(--l-orange-bg)] text-[var(--l-orange-fg)]",
    swatch: "bg-[var(--sw-orange)]",
  },
  yellow: {
    chip: "bg-[var(--l-yellow-bg)] text-[var(--l-yellow-fg)]",
    swatch: "bg-[var(--sw-yellow)]",
  },
  green: {
    chip: "bg-[var(--l-green-bg)] text-[var(--l-green-fg)]",
    swatch: "bg-[var(--sw-green)]",
  },
  blue: {
    chip: "bg-[var(--l-blue-bg)] text-[var(--l-blue-fg)]",
    swatch: "bg-[var(--sw-blue)]",
  },
  purple: {
    chip: "bg-[var(--l-purple-bg)] text-[var(--l-purple-fg)]",
    swatch: "bg-[var(--sw-purple)]",
  },
  pink: {
    chip: "bg-[var(--l-pink-bg)] text-[var(--l-pink-fg)]",
    swatch: "bg-[var(--sw-pink)]",
  },
};
