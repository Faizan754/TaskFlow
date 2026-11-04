import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { getColumns } from "../services/columnService";
import { getBoard } from "../services/boardService";
import { getCards, moveCard } from "../services/cardService";
import { type Column } from "../entities/Columns";
import { type Board } from "../entities/Boards";
import type { Card } from "../entities/Cards";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import BoardColumn from "../components/BoardColumn";
import CardItem from "../components/CardItem";
import CardModal from "../components/CardModal";

function withNormalizedPositions(cards: Card[]): Card[] {
  const counters = new Map<string, number>();
  return cards.map((card) => {
    const index = counters.get(card.column_id) ?? 0;
    counters.set(card.column_id, index + 1);
    return card.position === index ? card : { ...card, position: index };
  });
}

function indexInColumn(cards: Card[], cardId: string, columnId: string) {
  return cards
    .filter((card) => card.column_id === columnId)
    .findIndex((card) => card.id === cardId);
}

const BoardPage = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const [board, setBoard] = useState<Board | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [moveError, setMoveError] = useState<string | null>(null);
  const dragSnapshot = useRef<Card[] | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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

  const handleDragStart = ({ active }: DragStartEvent) => {
    setMoveError(null);
    dragSnapshot.current = cards;
    setActiveCard(cards.find((card) => card.id === String(active.id)) ?? null);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    const dragged = cards.find((card) => card.id === activeId);
    if (!dragged) return;

    const overCard = cards.find((card) => card.id === overId);
    const targetColumnId = overCard
      ? overCard.column_id
      : columns.find((column) => column.id === overId)?.id;

    if (!targetColumnId || targetColumnId === dragged.column_id) return;

    setCards((prev) => {
      const withoutDragged = prev.filter((card) => card.id !== activeId);
      const moved = { ...dragged, column_id: targetColumnId };

      if (!overCard) return [...withoutDragged, moved];

      const overIndex = withoutDragged.findIndex((card) => card.id === overId);
      const draggedRect = active.rect.current.translated;
      const isBelowOver = draggedRect
        ? draggedRect.top > over.rect.top + over.rect.height / 2
        : false;
      const insertAt = overIndex + (isBelowOver ? 1 : 0);

      return [
        ...withoutDragged.slice(0, insertAt),
        moved,
        ...withoutDragged.slice(insertAt),
      ];
    });
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    const snapshot = dragSnapshot.current;
    dragSnapshot.current = null;
    setActiveCard(null);

    if (!snapshot) return;
    if (!over) {
      setCards(snapshot);
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    let next = cards;
    const activeIndex = next.findIndex((card) => card.id === activeId);
    const overIndex = next.findIndex((card) => card.id === overId);
    if (
      activeIndex !== -1 &&
      overIndex !== -1 &&
      activeIndex !== overIndex &&
      next[activeIndex].column_id === next[overIndex].column_id
    ) {
      next = arrayMove(next, activeIndex, overIndex);
    }
    next = withNormalizedPositions(next);
    setCards(next);

    const before = snapshot.find((card) => card.id === activeId);
    const after = next.find((card) => card.id === activeId);
    if (!before || !after) return;

    const beforeIndex = indexInColumn(snapshot, activeId, before.column_id);
    const afterIndex = indexInColumn(next, activeId, after.column_id);
    if (before.column_id === after.column_id && beforeIndex === afterIndex) {
      return;
    }

    try {
      await moveCard({
        cardId: activeId,
        targetColumnId: after.column_id,
        targetIndex: afterIndex,
      });
    } catch (err) {
      console.error(err);
      setCards(snapshot);
      setMoveError("Couldn't save that move, so the card was put back.");
    }
  };

  const handleDragCancel = () => {
    if (dragSnapshot.current) setCards(dragSnapshot.current);
    dragSnapshot.current = null;
    setActiveCard(null);
  };

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

      {moveError && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {moveError}
        </p>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex flex-col gap-6 md:flex-row">
          {columns.map((column) => (
            <BoardColumn
              key={column.id}
              column={column}
              cards={cards.filter((card) => card.column_id === column.id)}
              onCardClick={setSelectedCard}
              onCardCreated={(card) => setCards((prev) => [...prev, card])}
            />
          ))}
        </div>

        <DragOverlay>
          {activeCard ? (
            <div className="rotate-2 cursor-grabbing shadow-lg">
              <CardItem card={activeCard} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

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
