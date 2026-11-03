import type { Card } from "../entities/Cards";

interface Props {
  card: Card;
  onClick?: () => void;
}

const CardItem = ({ card, onClick }: Props) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full rounded-md border border-gray-200 bg-gray-50 p-3 text-left shadow-sm hover:bg-gray-100"
  >
    <h4 className="text-sm font-medium text-gray-800">{card.title}</h4>
    {card.description && (
      <p className="mt-1 text-xs text-gray-500">{card.description}</p>
    )}
  </button>
);

export default CardItem;
