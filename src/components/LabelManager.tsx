import { useState, type SubmitEvent } from "react";
import { Check, CircleAlert, LoaderCircle, Plus, Trash2 } from "lucide-react";
import type { Label } from "../entities/Labels";
import {
  LABEL_COLORS,
  labelColorClasses,
  type LabelColor,
} from "../lib/labelColors";
import { createLabel, deleteLabel } from "../services/labelService";
import LabelChip from "./LabelChip";
import {
  btnBase,
  btnDanger,
  btnGhostDanger,
  btnIconSm,
  btnMd,
  btnPrimary,
  btnSecondary,
  btnSm,
  fieldError,
  input,
} from "../lib/ui";

interface Props {
  boardId: string;
  labels: Label[];
  onCreated: (label: Label) => void;
  onDeleted: (labelId: string) => void;
}

const swatchBase =
  "relative grid size-9 cursor-pointer place-content-center rounded-full max-md:size-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";
const swatchSelected =
  "ring-2 ring-fg ring-offset-2 ring-offset-surface-sunken";

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
    <div className="flex flex-col gap-5">
      {labels.length === 0 ? (
        <p className="text-sm text-muted">
          No labels yet. Create the first one below.
        </p>
      ) : (
        <ul className="flex flex-col gap-1" aria-label="Board labels">
          {labels.map((label) => (
            <li
              key={label.id}
              className="flex min-h-11 items-center gap-3 rounded-[10px] px-2 hover:bg-surface-sunken"
            >
              <LabelChip label={label} />
              {confirmingId === label.id ? (
                <div className="ml-auto flex flex-wrap items-center gap-2 rounded-xl bg-danger-soft py-1.5 pr-1.5 pl-3">
                  <span className="text-[13px] text-fg">
                    Remove from all cards?
                  </span>
                  <button
                    type="button"
                    onClick={() => setConfirmingId(null)}
                    disabled={busyId !== null}
                    className={`${btnBase} ${btnSm} ${btnSecondary}`}
                  >
                    Keep
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(label.id)}
                    disabled={busyId !== null}
                    className={`${btnBase} ${btnSm} ${btnDanger}`}
                  >
                    {busyId === label.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              ) : (
                <>
                  <span className="ml-auto text-xs text-muted capitalize">
                    {label.color}
                  </span>
                  <button
                    type="button"
                    onClick={() => setConfirmingId(label.id)}
                    aria-label={`Delete label ${label.name}`}
                    className={`${btnBase} ${btnIconSm} ${btnGhostDanger}`}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={handleCreate}
        className="flex flex-col gap-3.5 rounded-2xl border border-border bg-surface-sunken p-4"
      >
        <span className="text-[13px] font-semibold text-fg">New label</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Label name"
          maxLength={30}
          aria-label="Label name"
          data-autofocus
          className={input}
        />
        <div
          className="flex flex-wrap gap-2.5"
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
              title={option}
              onClick={() => setColor(option)}
              className={
                color === option
                  ? `${swatchBase} ${labelColorClasses[option].swatch} ${swatchSelected}`
                  : `${swatchBase} ${labelColorClasses[option].swatch}`
              }
            >
              {color === option && (
                <Check className="size-4 text-white" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs text-muted">Preview</span>
          <span
            className={`inline-flex h-7 max-w-full items-center gap-2 rounded-md px-2.5 text-[13px] leading-none font-semibold ${labelColorClasses[color].chip}`}
          >
            <span
              aria-hidden="true"
              className="size-[7px] shrink-0 rounded-[2px] bg-current"
            />
            <span className="truncate">{name.trim() || "Label name"}</span>
          </span>
          <button
            type="submit"
            disabled={saving || !name.trim()}
            className={`${btnBase} ${btnMd} ${btnPrimary} ml-auto`}
          >
            {saving ? (
              <LoaderCircle
                className="size-4 animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
            ) : (
              <Plus className="size-4" aria-hidden="true" />
            )}
            {saving ? "Adding…" : "Add label"}
          </button>
        </div>
        {error && (
          <p className={fieldError}>
            <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default LabelManager;
