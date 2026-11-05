import {
  defaultAnimateLayoutChanges,
  useSortable,
  type AnimateLayoutChanges,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card } from "../entities/Cards";
import CardItem from "./CardItem";
import type { Label } from "../entities/Labels";

// dnd-kit only animates layout changes for the card that was dragged, so the
// other cards jump when a card enters or leaves their column. Treating every
// card as "wasDragging" makes them slide instead. With reduced motion we keep
// dnd-kit's default, so nothing animates that didn't animate before.
const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? defaultAnimateLayoutChanges(args)
    : defaultAnimateLayoutChanges({ ...args, wasDragging: true });

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
  } = useSortable({ id: card.id, animateLayoutChanges });

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
