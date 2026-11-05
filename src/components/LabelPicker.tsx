import { useState } from "react";
import { Check, CircleAlert, Tag } from "lucide-react";
import type { CardLabel, Label } from "../entities/Labels";
import { labelColorClasses } from "../lib/labelColors";
import { addCardLabel, removeCardLabel } from "../services/labelService";
import { fieldError, sectionHeading } from "../lib/ui";

interface Props {
  cardId: string;
  labels: Label[];
  assignedLabelIds: string[];
  onAdded: (cardLabel: CardLabel) => void;
  onRemoved: (cardId: string, labelId: string) => void;
}

const toggleOff =
  "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-border-strong bg-surface px-2.5 text-[13px] font-semibold text-fg hover:bg-surface-sunken disabled:cursor-wait disabled:opacity-60 max-md:h-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";
const toggleOn =
  "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-transparent px-2.5 text-[13px] font-semibold disabled:cursor-wait disabled:opacity-60 max-md:h-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

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
    <div className="flex flex-col gap-2">
      <h4 className={sectionHeading}>
        <Tag className="size-4 text-muted" aria-hidden="true" />
        Labels
      </h4>
      {labels.length === 0 ? (
        <p className="text-sm text-muted">
          No labels yet. Create some with "Manage labels" on the board.
        </p>
      ) : (
        <ul className="flex flex-wrap gap-1.5">
          {labels.map((label) => {
            const assigned = assignedLabelIds.includes(label.id);
            return (
              <li key={label.id}>
                <button
                  type="button"
                  onClick={() => handleToggle(label)}
                  disabled={busyId !== null}
                  aria-pressed={assigned}
                  className={
                    assigned
                      ? `${toggleOn} ${labelColorClasses[label.color].chip}`
                      : toggleOff
                  }
                >
                  {assigned ? (
                    <Check className="size-3.5" aria-hidden="true" />
                  ) : (
                    <span
                      aria-hidden="true"
                      className={`size-2 shrink-0 rounded-[2px] ${labelColorClasses[label.color].swatch}`}
                    />
                  )}
                  {label.name}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {error && (
        <p className={fieldError}>
          <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
};

export default LabelPicker;
