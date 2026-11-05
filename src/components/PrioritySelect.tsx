import { ChevronDown } from "lucide-react";
import type { Priority } from "../entities/Cards";
import { label as labelClass, select } from "../lib/ui";

interface Props {
  value: Priority | null;
  onChange: (value: Priority | null) => void;
}

const PrioritySelect = ({ value, onChange }: Props) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor="card-priority" className={labelClass}>
      Priority
    </label>
    <div className="relative">
      <select
        id="card-priority"
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value === "" ? null : (e.target.value as Priority))
        }
        className={select}
      >
        <option value="">None</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted"
        aria-hidden="true"
      />
    </div>
  </div>
);

export default PrioritySelect;
