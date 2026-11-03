import { useState } from "react";
import { createCard } from "../services/cardService";
import type { Card } from "../entities/Cards";
import EntityForm from "./EntityForm";

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
        className="mt-3 w-full rounded-md px-3 py-2 text-left text-sm text-gray-500 hover:bg-gray-100"
      >
        + Add card
      </button>
    );
  }

  return (
    <div className="mt-3">
      <EntityForm
        titlePlaceholder="Card title"
        submitLabel="Add"
        showDescription
        submittingLabel="Adding..."
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
