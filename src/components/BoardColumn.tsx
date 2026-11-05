import { useState, type SubmitEvent } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Card } from "../entities/Cards";
import type { Column } from "../entities/Columns";
import { deleteColumn, renameColumn } from "../services/columnService";
import SortableCard from "./SortableCard";
import AddCard from "./AddCard";
import type { Label } from "../entities/Labels";
import {
  CircleAlert,
  LoaderCircle,
  Pencil,
  SquareKanban,
  Trash2,
} from "lucide-react";
import {
  btnBase,
  btnDanger,
  btnGhost,
  btnGhostDanger,
  btnIconSm,
  btnPrimary,
  btnSecondary,
  btnSm,
  fieldError,
  inputSm,
} from "../lib/ui";

const dotClasses = [
  "bg-[var(--sw-gray)]",
  "bg-[var(--sw-blue)]",
  "bg-[var(--sw-green)]",
  "bg-[var(--sw-purple)]",
] as const;

interface Props {
  column: Column;
  cards: Card[];
  labelsForCard: (cardId: string) => Label[];
  onCardClick: (card: Card) => void;
  onCardCreated: (card: Card) => void;
  onRenamed: (column: Column) => void;
  onDeleted: (columnId: string) => void;
}

const BoardColumn = ({
  column,
  cards,
  labelsForCard,
  onCardClick,
  onCardCreated,
  onRenamed,
  onDeleted,
}: Props) => {
  const { setNodeRef } = useDroppable({ id: column.id });

  const [isRenaming, setIsRenaming] = useState(false);
  const [titleDraft, setTitleDraft] = useState(column.title);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextPosition =
    cards.length === 0
      ? 0
      : Math.max(...cards.map((card) => card.position)) + 1;

  const startRename = () => {
    setTitleDraft(column.title);
    setError(null);
    setIsRenaming(true);
  };

  const cancelRename = () => {
    setTitleDraft(column.title);
    setIsRenaming(false);
  };

  const handleRename = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = titleDraft.trim();
    if (!title || busy) return;
    if (title === column.title) {
      setIsRenaming(false);
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const updated = await renameColumn(column.id, title);
      onRenamed(updated);
      setIsRenaming(false);
    } catch (err) {
      console.error(err);
      setError("Couldn't rename the column. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await deleteColumn(column.id);
      onDeleted(column.id);
    } catch (err) {
      console.error(err);
      setError("Couldn't delete the column. Please try again.");
      setBusy(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className="flex w-[304px] shrink-0 snap-start flex-col gap-2 rounded-2xl border border-transparent bg-surface-sunken p-2.5"
    >
      <div>
        <div className="flex min-h-9 items-center gap-2 pt-1 pr-0.5 pb-1.5 pl-1.5">
          {isRenaming ? (
            <form
              onSubmit={handleRename}
              className="flex flex-1 items-center gap-1.5"
            >
              <input
                autoFocus
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") cancelRename();
                }}
                aria-label="Column title"
                className={inputSm}
              />
              <button
                type="submit"
                disabled={busy || !titleDraft.trim()}
                className={`${btnBase} ${btnSm} ${btnPrimary}`}
              >
                Save
              </button>
              <button
                type="button"
                onClick={cancelRename}
                className={`${btnBase} ${btnSm} ${btnGhost}`}
              >
                Cancel
              </button>
            </form>
          ) : (
            <>
              <span
                aria-hidden="true"
                className={`size-2 shrink-0 rounded-full ${dotClasses[((column.position % 4) + 4) % 4]}`}
              />
              <h2 className="min-w-0 truncate font-display text-sm font-semibold tracking-tight text-fg">
                {column.title}
              </h2>
              <span className="inline-grid h-[22px] min-w-[22px] place-content-center rounded-full border border-border bg-surface px-[7px] text-xs font-semibold text-muted">
                {cards.length}
              </span>
              <div className="ml-auto flex">
                <button
                  type="button"
                  onClick={startRename}
                  aria-label={`Rename column ${column.title}`}
                  className={`${btnBase} ${btnIconSm} ${btnGhost}`}
                >
                  <Pencil aria-hidden="true" className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  aria-label={`Delete column ${column.title}`}
                  className={`${btnBase} ${btnIconSm} ${btnGhostDanger}`}
                >
                  <Trash2 aria-hidden="true" className="size-4" />
                </button>
              </div>
            </>
          )}
        </div>

        {confirmingDelete && (
          <div className="mt-1 flex flex-col gap-2 rounded-xl bg-danger-soft p-3 text-[13px] text-fg">
            <p>
              Delete this column
              {cards.length > 0
                ? ` and its ${cards.length} card${cards.length === 1 ? "" : "s"}`
                : ""}
              ? This can't be undone.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDelete}
                disabled={busy}
                className={`${btnBase} ${btnSm} ${btnDanger}`}
              >
                {busy && (
                  <LoaderCircle
                    aria-hidden="true"
                    className="size-4 animate-spin motion-reduce:animate-none"
                  />
                )}
                {busy ? "Deleting…" : "Delete"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                disabled={busy}
                className={`${btnBase} ${btnSm} ${btnSecondary}`}
              >
                Keep
              </button>
            </div>
          </div>
        )}

        {error && (
          <p className={`mt-2 ${fieldError}`}>
            <CircleAlert aria-hidden="true" className="size-4 shrink-0" />
            {error}
          </p>
        )}
      </div>

      <SortableContext
        items={cards.map((card) => card.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="flex min-h-8 flex-col gap-2">
          {cards.map((card) => (
            <SortableCard
              key={card.id}
              card={card}
              labels={labelsForCard(card.id)}
              onClick={() => onCardClick(card)}
            />
          ))}
        </ul>
      </SortableContext>

      {cards.length === 0 && (
        <div className="flex flex-col items-center gap-1.5 rounded-xl border-[1.5px] border-dashed border-border-strong px-3 py-7 text-center">
          <SquareKanban aria-hidden="true" className="size-5 text-muted" />
          <span className="text-[13px] leading-[18px] font-semibold text-fg">
            No cards yet
          </span>
          <span className="text-xs text-muted">
            Drag a card here or add one below.
          </span>
        </div>
      )}

      <AddCard
        columnId={column.id}
        position={nextPosition}
        onCardCreated={onCardCreated}
      />
    </div>
  );
};

export default BoardColumn;
