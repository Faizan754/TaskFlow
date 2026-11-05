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
      className="flex-1 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div className="mb-4 border-b border-gray-200 pb-2">
        <div className="flex items-center justify-between gap-2">
          {isRenaming ? (
            <form
              onSubmit={handleRename}
              className="flex flex-1 items-center gap-2"
            >
              <input
                autoFocus
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") cancelRename();
                }}
                aria-label="Column title"
                className="min-w-0 flex-1 rounded border border-gray-300 px-2 py-1 text-sm text-gray-900"
              />
              <button
                type="submit"
                disabled={busy || !titleDraft.trim()}
                className="text-xs font-semibold text-blue-600 disabled:opacity-50"
              >
                Save
              </button>
              <button
                type="button"
                onClick={cancelRename}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </form>
          ) : (
            <>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                {column.title}
              </h3>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                  {cards.length}
                </span>
                <button
                  type="button"
                  onClick={startRename}
                  className="text-xs text-gray-400 hover:text-gray-700"
                >
                  Rename
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  className="text-xs text-gray-400 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>

        {confirmingDelete && (
          <div className="mt-2 rounded-md bg-red-50 p-2 text-xs text-red-800">
            <p>
              Delete this column
              {cards.length > 0
                ? ` and its ${cards.length} card${cards.length === 1 ? "" : "s"}`
                : ""}
              ? This can't be undone.
            </p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={handleDelete}
                disabled={busy}
                className="rounded bg-red-600 px-2 py-1 font-semibold text-white disabled:opacity-60"
              >
                {busy ? "Deleting..." : "Delete"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                disabled={busy}
                className="rounded px-2 py-1 text-gray-700 hover:bg-red-100"
              >
                Keep
              </button>
            </div>
          </div>
        )}

        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      </div>

      <SortableContext
        items={cards.map((card) => card.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="min-h-8 space-y-2">
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
        <p className="text-sm italic text-gray-400">No tasks yet</p>
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
