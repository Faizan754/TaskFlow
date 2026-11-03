import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card } from "../entities/Cards";
import CardItem from "./CardItem";

interface Props {
  card: Card;
  onClick: () => void;
}

const SortableCard = ({ card, onClick }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
      {...attributes}
      {...listeners}
    >
      <CardItem card={card} onClick={onClick} />
    </li>
  );
};

export default SortableCard;
