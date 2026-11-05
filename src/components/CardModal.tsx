import { useState } from "react";
import {
  AlignLeft,
  CircleAlert,
  LoaderCircle,
  Pencil,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import Modal from "./Modal";
import EntityForm from "./EntityForm";
import PrioritySelect from "./PrioritySelect";
import SubtaskList from "./SubtaskList";
import { updateCard, deleteCard } from "../services/cardService";
import type { Card, Priority } from "../entities/Cards";
import LabelPicker from "./LabelPicker";
import type { CardLabel, Label } from "../entities/Labels";
import PriorityBadge from "./PriorityBadge";
import {
  alertDanger,
  btnBase,
  btnDanger,
  btnGhostDanger,
  btnMd,
  btnSecondary,
  btnSm,
  sectionHeading,
} from "../lib/ui";

interface Props {
  card: Card | null;
  labels: Label[];
  assignedLabelIds: string[];
  onLabelAdded: (cardLabel: CardLabel) => void;
  onLabelRemoved: (cardId: string, labelId: string) => void;
  onClose: () => void;
  onUpdated: (card: Card) => void;
  onDeleted: (cardId: string) => void;
}

const CardModalContent = ({
  card,
  labels,
  assignedLabelIds,
  onLabelAdded,
  onLabelRemoved,
  onClose,
  onUpdated,
  onDeleted,
}: Omit<Props, "card"> & { card: Card }) => {
  const [priority, setPriority] = useState<Priority | null>(card.priority);
  const [isEditing, setIsEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteCard(card.id);
      onDeleted(card.id);
      onClose();
    } catch (err) {
      console.error(err);
      setDeleteError("Couldn't delete the card. Please try again.");
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {isEditing ? (
        <EntityForm
          label="Title"
          titlePlaceholder="Card title"
          submitLabel="Save changes"
          submittingLabel="Saving…"
          showDescription
          initialTitle={card.title}
          initialDescription={card.description ?? ""}
          resetOnSuccess={false}
          errorMessage="Couldn't save the card. Please try again."
          extraFields={
            <PrioritySelect value={priority} onChange={setPriority} />
          }
          onCancel={() => setIsEditing(false)}
          onSubmit={async ({ title, description }) => {
            const updated = await updateCard({
              id: card.id,
              title,
              description,
              priority,
            });
            onUpdated(updated);
            setIsEditing(false);
          }}
        />
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <h3 className="min-w-0 flex-1 font-display text-[22px] leading-7 font-semibold tracking-tight break-words text-fg">
              {card.title}
            </h3>
            <button
              type="button"
              onClick={() => {
                setPriority(card.priority);
                setIsEditing(true);
              }}
              aria-label="Edit card details"
              className={`${btnBase} ${btnSm} ${btnSecondary} shrink-0`}
            >
              <Pencil className="size-3.5" aria-hidden="true" />
              Edit
            </button>
          </div>
          {card.priority && (
            <div className="flex">
              <PriorityBadge priority={card.priority} />
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <h4 className={sectionHeading}>
              <AlignLeft className="size-4 text-muted" aria-hidden="true" />
              Description
            </h4>
            {card.description ? (
              <p className="text-[15px] leading-6 whitespace-pre-wrap break-words text-fg">
                {card.description}
              </p>
            ) : (
              <p className="text-sm text-muted">No description</p>
            )}
          </div>
        </div>
      )}

      <SubtaskList
        cardId={card.id}
        cardTitle={card.title}
        cardDescription={card.description}
      />
      <LabelPicker
        cardId={card.id}
        labels={labels}
        assignedLabelIds={assignedLabelIds}
        onAdded={onLabelAdded}
        onRemoved={onLabelRemoved}
      />

      <div className="border-t border-border pt-4">
        {confirming ? (
          <div
            role="alertdialog"
            aria-labelledby="delete-card-title"
            className="flex flex-wrap items-center gap-3 rounded-xl bg-danger-soft p-3"
          >
            <TriangleAlert
              className="size-5 shrink-0 text-danger-text"
              aria-hidden="true"
            />
            <div className="mr-auto flex min-w-0 flex-col">
              <span
                id="delete-card-title"
                className="text-[13px] font-semibold text-fg"
              >
                Delete this card?
              </span>
              <span className="text-xs text-muted">
                This also deletes its subtasks and can't be undone.
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                disabled={deleting}
                className={`${btnBase} ${btnSm} ${btnSecondary}`}
              >
                Keep
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className={`${btnBase} ${btnSm} ${btnDanger}`}
              >
                {deleting ? (
                  <LoaderCircle
                    className="size-4 animate-spin motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                ) : (
                  <Trash2 className="size-4" aria-hidden="true" />
                )}
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className={`${btnBase} ${btnMd} ${btnGhostDanger} justify-start`}
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Delete card
          </button>
        )}
        {deleteError && (
          <p role="alert" className={`${alertDanger} mt-3`}>
            <CircleAlert
              className="mt-0.5 size-4 shrink-0"
              aria-hidden="true"
            />
            {deleteError}
          </p>
        )}
      </div>
    </div>
  );
};

const CardModal = ({
  card,
  onClose,
  onUpdated,
  onDeleted,
  labels,
  assignedLabelIds,
  onLabelAdded,
  onLabelRemoved,
}: Props) => (
  <Modal isOpen={card !== null} onClose={onClose} title="Card details">
    {card && (
      <CardModalContent
        key={card.id}
        card={card}
        labels={labels}
        assignedLabelIds={assignedLabelIds}
        onLabelAdded={onLabelAdded}
        onLabelRemoved={onLabelRemoved}
        onClose={onClose}
        onUpdated={onUpdated}
        onDeleted={onDeleted}
      />
    )}
  </Modal>
);

export default CardModal;
