import type { Priority } from "../entities/Cards";

const styles: Record<Priority, string> = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

const labels: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const PriorityBadge = ({ priority }: { priority: Priority }) => (
  <span
    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${styles[priority]}`}
  >
    {labels[priority]}
  </span>
);

export default PriorityBadge;
