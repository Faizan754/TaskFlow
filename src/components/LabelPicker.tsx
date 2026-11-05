import { useState } from "react";
import type { CardLabel, Label } from "../entities/Labels";
import { labelColorClasses } from "../lib/labelColors";
import { addCardLabel, removeCardLabel } from "../services/labelService";

interface Props {
  cardId: string;
  labels: Label[];
  assignedLabelIds: string[];
  onAdded: (cardLabel: CardLabel) => void;
  onRemoved: (cardId: string, labelId: string) => void;
}

const LabelPicker = ({
  cardId,
  labels,
  assignedLabelIds,
  onAdded,
  onRemoved,
}: Props) => {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async (label: Label) => {
    if (busyId) return;
    const assigned = assignedLabelIds.includes(label.id);
    setBusyId(label.id);
    setError(null);
    try {
      if (assigned) {
        await removeCardLabel(cardId, label.id);
        onRemoved(cardId, label.id);
      } else {
        const created = await addCardLabel(cardId, label.id);
        onAdded(created);
      }
    } catch (err) {
      console.error(err);
      setError("Couldn't update the label. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-2 border-t border-gray-200 pt-4">
      <h4 className="text-sm font-semibold text-gray-700">Labels</h4>
      {labels.length === 0 ? (
        <p className="text-sm text-gray-400">
          No labels yet. Create some with "Manage labels" on the board.
        </p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {labels.map((label) => {
            const assigned = assignedLabelIds.includes(label.id);
            return (
              <li key={label.id}>
                <button
                  type="button"
                  onClick={() => handleToggle(label)}
                  disabled={busyId !== null}
                  aria-pressed={assigned}
                  className={`rounded-full px-3 py-1 text-xs font-medium disabled:cursor-wait ${
                    labelColorClasses[label.color].chip
                  } ${
                    assigned
                      ? "ring-2 ring-gray-700 ring-offset-1"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  {assigned ? "✓ " : ""}
                  {label.name}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default LabelPicker;
