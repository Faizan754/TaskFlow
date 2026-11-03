import { useState } from "react";
import Modal from "./Modal";
import EntityForm from "./EntityForm";
import { updateCard, deleteCard } from "../services/cardService";
import type { Card } from "../entities/Cards";

interface Props {
  card: Card | null;
  onClose: () => void;
  onUpdated: (card: Card) => void;
  onDeleted: (cardId: string) => void;
}

const CardModalContent = ({
  card,
  onClose,
  onUpdated,
  onDeleted,
}: Omit<Props, "card"> & { card: Card }) => {
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
    <div className="space-y-6">
      <EntityForm
        label="Title"
        titlePlaceholder="Card title"
        submitLabel="Save"
        submittingLabel="Saving..."
        showDescription
        initialTitle={card.title}
        initialDescription={card.description ?? ""}
        resetOnSuccess={false}
        errorMessage="Couldn't save the card. Please try again."
        onCancel={onClose}
        onSubmit={async ({ title, description }) => {
          const updated = await updateCard({ id: card.id, title, description });
          onUpdated(updated);
          onClose();
        }}
      />

      <div className="border-t border-gray-200 pt-4">
        {confirming ? (
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-gray-700">Delete this card for good?</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                disabled={deleting}
                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Keep
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="text-sm font-semibold text-red-600 hover:text-red-700"
          >
            Delete card
          </button>
        )}
        {deleteError && (
          <p className="mt-2 text-sm text-red-600">{deleteError}</p>
        )}
      </div>
    </div>
  );
};

const CardModal = ({ card, onClose, onUpdated, onDeleted }: Props) => (
  <Modal isOpen={card !== null} onClose={onClose} title="Edit card">
    {card && (
      <CardModalContent
        key={card.id}
        card={card}
        onClose={onClose}
        onUpdated={onUpdated}
        onDeleted={onDeleted}
      />
    )}
  </Modal>
);

export default CardModal;
