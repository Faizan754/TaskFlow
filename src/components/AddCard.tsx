import { useState } from "react";
import { Plus } from "lucide-react";
import { createCard } from "../services/cardService";
import type { Card } from "../entities/Cards";
import EntityForm from "./EntityForm";
import { addCardBtn } from "../lib/ui";

interface Props {
  columnId: string;
  position: number;
  onCardCreated: (card: Card) => void;
}

const AddCard = ({ columnId, position, onCardCreated }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={addCardBtn}
      >
        <Plus aria-hidden="true" className="size-4" />
        Add card
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface-raised p-2.5">
      <EntityForm
        titlePlaceholder="Card title"
        submitLabel="Add card"
        showDescription
        submittingLabel="Adding…"
        errorMessage="Couldn't add the card. Please try again."
        onCancel={() => setIsOpen(false)}
        onSubmit={async ({ title, description }) => {
          const card = await createCard({
            columnId,
            title,
            description,
            position,
          });
          onCardCreated(card);
          setIsOpen(false);
        }}
      />
    </div>
  );
};

export default AddCard;
