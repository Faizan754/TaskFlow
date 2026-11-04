import type { Priority } from "../entities/Cards";

interface Props {
  value: Priority | null;
  onChange: (value: Priority | null) => void;
}

const PrioritySelect = ({ value, onChange }: Props) => (
  <div>
    <label
      htmlFor="card-priority"
      className="mb-1 block text-sm font-medium text-gray-700"
    >
      Priority
    </label>
    <select
      id="card-priority"
      value={value ?? ""}
      onChange={(e) =>
        onChange(e.target.value === "" ? null : (e.target.value as Priority))
      }
      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm"
    >
      <option value="">None</option>
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>
  </div>
);

export default PrioritySelect;
