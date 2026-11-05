import { useState, type SubmitEvent } from "react";
import type { Label } from "../entities/Labels";
import {
  LABEL_COLORS,
  labelColorClasses,
  type LabelColor,
} from "../lib/labelColors";
import { createLabel, deleteLabel } from "../services/labelService";
import LabelChip from "./LabelChip";

interface Props {
  boardId: string;
  labels: Label[];
  onCreated: (label: Label) => void;
  onDeleted: (labelId: string) => void;
}

const LabelManager = ({ boardId, labels, onCreated, onDeleted }: Props) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState<LabelColor>("blue");
  const [saving, setSaving] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || saving) return;

    setSaving(true);
    setError(null);
    try {
      const created = await createLabel({ boardId, name: trimmed, color });
      onCreated(created);
      setName("");
    } catch (err) {
      console.error(err);
      setError("Couldn't create the label. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (busyId) return;
    setBusyId(id);
    setError(null);
    try {
      await deleteLabel(id);
      onDeleted(id);
      setConfirmingId(null);
    } catch (err) {
      console.error(err);
      setError("Couldn't delete the label. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-5">
      {labels.length === 0 ? (
        <p className="text-sm text-gray-500">
          No labels yet. Create the first one below.
        </p>
      ) : (
        <ul className="space-y-2">
          {labels.map((label) => (
            <li
              key={label.id}
              className="flex items-center justify-between gap-3"
            >
              <LabelChip label={label} />
              {confirmingId === label.id ? (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-600">Remove from all cards?</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(label.id)}
                    disabled={busyId !== null}
                    className="font-semibold text-red-600 disabled:opacity-60"
                  >
                    {busyId === label.id ? "Deleting..." : "Delete"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingId(null)}
                    disabled={busyId !== null}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Keep
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingId(label.id)}
                  className="text-xs text-gray-400 hover:text-red-600"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={handleCreate}
        className="space-y-3 border-t border-gray-200 pt-4"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Label name"
          maxLength={30}
          aria-label="Label name"
          className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400"
        />
        <div
          className="flex flex-wrap gap-2"
          role="radiogroup"
          aria-label="Label color"
        >
          {LABEL_COLORS.map((option) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={color === option}
              aria-label={option}
              onClick={() => setColor(option)}
              className={`h-6 w-6 rounded-full ${labelColorClasses[option].swatch} ${
                color === option ? "ring-2 ring-gray-800 ring-offset-2" : ""
              }`}
            />
          ))}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Creating..." : "Add label"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LabelManager;
