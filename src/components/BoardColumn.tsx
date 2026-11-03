import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Card } from "../entities/Cards";
import type { Column } from "../entities/Columns";
import SortableCard from "./SortableCard";
import AddCard from "./AddCard";

interface Props {
  column: Column;
  cards: Card[];
  onCardClick: (card: Card) => void;
  onCardCreated: (card: Card) => void;
}

const BoardColumn = ({ column, cards, onCardClick, onCardCreated }: Props) => {
  // The whole column is a drop target, so empty columns can receive cards too.
  const { setNodeRef } = useDroppable({ id: column.id });

  const nextPosition =
    cards.length === 0
      ? 0
      : Math.max(...cards.map((card) => card.position)) + 1;

  return (
    <div
      ref={setNodeRef}
      className="flex-1 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
          {column.title}
        </h3>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
          {cards.length}
        </span>
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
