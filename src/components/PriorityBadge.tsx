import { ArrowDown, ArrowUp, Equal, type LucideIcon } from "lucide-react";
import type { Priority } from "../entities/Cards";

const styles: Record<Priority, string> = {
  low: "bg-[var(--p-low-bg)] text-[var(--p-low-fg)]",
  medium: "bg-[var(--p-med-bg)] text-[var(--p-med-fg)]",
  high: "bg-[var(--p-high-bg)] text-[var(--p-high-fg)]",
};

const icons: Record<Priority, LucideIcon> = {
  low: ArrowDown,
  medium: Equal,
  high: ArrowUp,
};

const labels: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const Icon = icons[priority];
  return (
    <span
      className={`inline-flex h-[22px] shrink-0 items-center gap-1 rounded-full pr-2 pl-1.5 text-xs leading-none font-semibold whitespace-nowrap ${styles[priority]}`}
    >
      <Icon aria-hidden="true" className="size-3" />
      {labels[priority]}
    </span>
  );
};

export default PriorityBadge;
