import type { Card } from "../entities/Cards";
import type { Label } from "../entities/Labels";
import PriorityBadge from "./PriorityBadge";
import LabelChip from "./LabelChip";

interface Props {
  card: Card;
  labels?: Label[];
  onClick?: () => void;
}

const CardItem = ({ card, labels, onClick }: Props) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full rounded-md border border-gray-200 bg-gray-50 p-3 text-left shadow-sm hover:bg-gray-100"
  >
    <div className="flex items-start justify-between gap-2">
      <h4 className="text-sm font-medium text-gray-800">{card.title}</h4>
      {card.priority && <PriorityBadge priority={card.priority} />}
    </div>
    {card.description && (
      <p className="mt-1 text-xs text-gray-500">{card.description}</p>
    )}
    {labels && labels.length > 0 && (
      <div className="mt-2 flex flex-wrap gap-1">
        {labels.map((label) => (
          <LabelChip key={label.id} label={label} />
        ))}
      </div>
    )}
  </button>
);

export default CardItem;
