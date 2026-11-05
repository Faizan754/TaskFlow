import type { Label } from "../entities/Labels";
import { labelColorClasses } from "../lib/labelColors";

const LabelChip = ({ label }: { label: Label }) => (
  <span
    className={`inline-flex h-[22px] max-w-full items-center gap-1.5 rounded-md pr-2 pl-[7px] text-xs leading-none font-semibold ${labelColorClasses[label.color].chip}`}
  >
    <span
      aria-hidden="true"
      className="size-[7px] shrink-0 rounded-[2px] bg-current"
    />
    <span className="truncate">{label.name}</span>
  </span>
);

export default LabelChip;
