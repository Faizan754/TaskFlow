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
import AddColumn from "../components/AddColumn";
import { getLabels, getCardLabels } from "../services/labelService";
import type { Label, CardLabel } from "../entities/Labels";
import LabelManager from "../components/LabelManager";
import Modal from "../components/Modal";
import { CircleAlert, Tag } from "lucide-react";
import { alertDanger, btnBase, btnMd, btnSecondary } from "../lib/ui";

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
  const [labels, setLabels] = useState<Label[]>([]);
  const [cardLabels, setCardLabels] = useState<CardLabel[]>([]);
  const [isLabelsOpen, setIsLabelsOpen] = useState(false);

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
        const [boardResult, columnResult, labelResult] = await Promise.all([
          getBoard(boardId!),
          getColumns(boardId!),
          getLabels(boardId!),
        ]);
        setBoard(boardResult);
        setColumns(columnResult);
        setLabels(labelResult);
        const [cardResult, cardLabelResult] = await Promise.all([
          getCards(columnResult.map((column) => column.id)),
          getCardLabels(labelResult.map((label) => label.id)),
        ]);
        setCards(cardResult);
        setCardLabels(cardLabelResult);
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

  const labelsForCard = (cardId: string): Label[] => {
    const ids = new Set(
      cardLabels
        .filter((item) => item.card_id === cardId)
        .map((item) => item.label_id),
    );
    return labels.filter((label) => ids.has(label.id));
  };

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
      <div className="mx-auto w-full max-w-[1240px] px-10 pt-12 max-md:px-4 max-md:pt-8">
        <ErrorMessage
          content="Something went wrong while loading this board. Please try again or go back to "
          link="dashboard"
          linkText="Dashboard"
        />
      </div>
    );
  }
  if (board === null) {
    return (
      <div className="mx-auto w-full max-w-[1240px] px-10 pt-12 max-md:px-4 max-md:pt-8">
        <ErrorMessage
          content="Board not found! Return to "
          linkText="Dashboard"
          link="dashboard"
        />
      </div>
    );
  }
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex flex-col gap-2.5 px-10 pt-6 pb-4 max-md:px-4 max-md:pt-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="mr-auto min-w-0 font-display text-[36px] leading-[44px] font-bold tracking-tight break-words text-fg max-md:text-[28px] max-md:leading-9">
            {board.title}
          </h1>
          <button
            type="button"
            onClick={() => setIsLabelsOpen(true)}
            className={`${btnBase} ${btnMd} ${btnSecondary}`}
          >
            <Tag aria-hidden="true" className="size-4" />
            Manage labels
          </button>
        </div>
      </div>

      {moveError && (
        <div className="px-10 pb-3 max-md:px-4">
          <p role="alert" className={alertDanger}>
            <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            {moveError}
          </p>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex items-start gap-4 overflow-x-auto snap-x snap-proximity px-10 pt-1 pb-8 max-md:gap-3 max-md:px-4 max-md:pb-6">
          {columns.map((column) => (
            <BoardColumn
              key={column.id}
              column={column}
              cards={cards.filter((card) => card.column_id === column.id)}
              labelsForCard={labelsForCard}
              onCardClick={setSelectedCard}
              onCardCreated={(card) => setCards((prev) => [...prev, card])}
              onRenamed={(updated) =>
                setColumns((prev) =>
                  prev.map((item) => (item.id === updated.id ? updated : item)),
                )
              }
              onDeleted={(id) => {
                setColumns((prev) => prev.filter((item) => item.id !== id));
                setCards((prev) =>
                  prev.filter((card) => card.column_id !== id),
                );
              }}
            />
          ))}
          <AddColumn
            boardId={board.id}
            position={
              columns.length === 0
                ? 0
                : Math.max(...columns.map((item) => item.position)) + 1
            }
            onColumnCreated={(column) =>
              setColumns((prev) => [...prev, column])
            }
          />
        </div>

        <DragOverlay>
          {activeCard ? (
            <div className="rotate-3 scale-[1.02] cursor-grabbing rounded-xl shadow-drag motion-reduce:rotate-0 motion-reduce:scale-100 [&>button]:cursor-grabbing [&>button]:border-primary!">
              <CardItem
                card={activeCard}
                labels={labelsForCard(activeCard.id)}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <Modal
        isOpen={isLabelsOpen}
        onClose={() => setIsLabelsOpen(false)}
        title="Manage labels"
      >
        <LabelManager
          boardId={board.id}
          labels={labels}
          onCreated={(label) => setLabels((prev) => [...prev, label])}
          onDeleted={(id) => {
            setLabels((prev) => prev.filter((label) => label.id !== id));
            setCardLabels((prev) =>
              prev.filter((item) => item.label_id !== id),
            );
          }}
        />
      </Modal>

      <CardModal
        card={selectedCard}
        labels={labels}
        assignedLabelIds={
          selectedCard
            ? cardLabels
                .filter((item) => item.card_id === selectedCard.id)
                .map((item) => item.label_id)
            : []
        }
        onLabelAdded={(item) => setCardLabels((prev) => [...prev, item])}
        onLabelRemoved={(cardId, labelId) =>
          setCardLabels((prev) =>
            prev.filter(
              (item) => !(item.card_id === cardId && item.label_id === labelId),
            ),
          )
        }
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
