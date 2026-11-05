import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card } from "../entities/Cards";
import CardItem from "./CardItem";
import type { Label } from "../entities/Labels";

interface Props {
  card: Card;
  labels?: Label[];
  onClick: () => void;
}

const SortableCard = ({ card, labels, onClick }: Props) => {
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
      className={
        isDragging
          ? "list-none rounded-xl cursor-grabbing outline-2 outline-dashed outline-primary"
          : "list-none rounded-xl cursor-grab focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      }
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
      {...attributes}
      {...listeners}
    >
      <CardItem card={card} labels={labels} onClick={onClick} />
    </li>
  );
};

export default SortableCard;
