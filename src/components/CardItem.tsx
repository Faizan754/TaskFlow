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
    className="flex w-full cursor-grab flex-col gap-2.5 rounded-xl border border-border bg-surface-raised px-3.5 py-3 text-left text-fg shadow-sm transition-[box-shadow,border-color] duration-150 hover:border-border-strong hover:shadow-md motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
  >
    <span className="text-sm leading-5 font-semibold break-words">
      {card.title}
    </span>
    {card.description && (
      <span className="line-clamp-2 text-[13px] leading-[18px] text-muted">
        {card.description}
      </span>
    )}
    {(card.priority || (labels && labels.length > 0)) && (
      <span className="flex flex-wrap items-center gap-1.5">
        {card.priority && <PriorityBadge priority={card.priority} />}
        {labels?.map((label) => (
          <LabelChip key={label.id} label={label} />
        ))}
      </span>
    )}
  </button>
);

export default CardItem;
