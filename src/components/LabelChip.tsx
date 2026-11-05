import type { Label } from "../entities/Labels";
import { labelColorClasses } from "../lib/labelColors";

const LabelChip = ({ label }: { label: Label }) => (
  <span
    className={`rounded-full px-2 py-0.5 text-xs font-medium ${labelColorClasses[label.color].chip}`}
  >
    {label.name}
  </span>
);

export default LabelChip;
