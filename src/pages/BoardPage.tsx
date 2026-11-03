import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getColumns } from "../services/columnService";
import { getBoard } from "../services/boardService";
import { type Column } from "../entities/Columns";
import { type Board } from "../entities/Boards";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { getCards } from "../services/cardService";
import type { Card } from "../entities/Cards";
import AddCard from "../components/AddCard";
import CardModal from "../components/CardModal";

const BoardPage = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const [board, setBoard] = useState<Board | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  useEffect(() => {
    async function load() {
      try {
        // the route guarantees boardId exists since you cant access board page without a boardId.
        const [boardResult, columnResult] = await Promise.all([
          getBoard(boardId!),
          getColumns(boardId!),
        ]);
        setBoard(boardResult);
        setColumns(columnResult);
        const cardResult = await getCards(
          columnResult.map((column) => column.id),
        );
        setCards(cardResult);
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
          setError(err.message);
        } else {
          console.error("Unexpected error occurred", err);
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [boardId]);
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return (
      <ErrorMessage
        content="Something went wrong while loading this board. Please try again or go back to "
        link="dashboard"
        linkText="Dashboard"
      />
    );
  }
  if (board === null) {
    return (
      <ErrorMessage
        content="Board not found! Return to "
        linkText="Dashboard"
        link="dashboard"
      />
    );
  }
  return (
    <div className="mx-auto w-full max-w-5xl p-6">
      <h1 className="mb-8 text-2xl font-bold text-gray-800">
        Board: <span className="text-blue-600">{board.title}</span>
      </h1>

      <div className="flex flex-col gap-6 md:flex-row">
        {columns.map((column) => {
          const columnCards = cards.filter(
            (card) => card.column_id === column.id,
          );

          return (
            <div
              key={column.id}
              className="flex-1 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                  {column.title}
                </h3>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                  {columnCards.length}
                </span>
              </div>

              {columnCards.length === 0 ? (
                <p className="text-sm italic text-gray-400">No tasks yet</p>
              ) : (
                <ul className="space-y-2">
                  {columnCards.map((card) => (
                    <li key={card.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedCard(card)}
                        className="w-full rounded-md border border-gray-200 bg-gray-50 p-3 text-left shadow-sm hover:bg-gray-100"
                      >
                        <h4 className="text-sm font-medium text-gray-800">
                          {card.title}
                        </h4>
                        {card.description && (
                          <p className="mt-1 text-xs text-gray-500">
                            {card.description}
                          </p>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <AddCard
                columnId={column.id}
                position={
                  columnCards.length === 0
                    ? 0
                    : Math.max(...columnCards.map((card) => card.position)) + 1
                }
                onCardCreated={(card) => setCards((prev) => [...prev, card])}
              />
            </div>
          );
        })}
      </div>
      <CardModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
        onUpdated={(updated) =>
          setCards((prev) =>
            prev.map((card) => (card.id === updated.id ? updated : card)),
          )
        }
        onDeleted={(id) =>
          setCards((prev) => prev.filter((card) => card.id !== id))
        }
      />
    </div>
  );
};

export default BoardPage;
