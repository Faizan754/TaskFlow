import { useEffect, useState } from "react";
import { getBoards, deleteBoard } from "../services/boardService";
import { type Board } from "../entities/Boards";
import CreateBoard from "../components/CreateBoard";
import { Link } from "react-router";
import Modal from "../components/Modal";
import ErrorMessage from "../components/ErrorMessage";
import {
  ArrowRight,
  CircleAlert,
  LoaderCircle,
  Plus,
  SquareKanban,
  Trash2,
} from "lucide-react";
import {
  alertDanger,
  btnBase,
  btnBrand,
  btnDanger,
  btnGhostDanger,
  btnIconSm,
  btnLg,
  btnMd,
  btnSecondary,
  skel,
} from "../lib/ui";

const pageBox =
  "mx-auto flex w-full max-w-[1240px] flex-col gap-7 px-10 pt-12 pb-16 max-md:px-4 max-md:pt-8";
const pageTitle =
  "font-display text-[36px] leading-[44px] font-bold tracking-tight text-fg max-md:text-[28px] max-md:leading-9";
const gridClass =
  "grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-5 max-md:grid-cols-1 max-md:gap-3";
const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

const Dashboard = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState<Board | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const closeDeleteModal = () => {
    setBoardToDelete(null);
    setDeleteError(null);
  };

  const handleDeleteBoard = async () => {
    if (!boardToDelete || deleting) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteBoard(boardToDelete.id);
      setBoards((prev) =>
        prev.filter((board) => board.id !== boardToDelete.id),
      );
      setBoardToDelete(null);
    } catch (err) {
      console.error(err);
      setDeleteError("Couldn't delete the board. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    getBoards()
      .then((res) => setBoards(res))
      .catch((err) => {
        console.log(err.message);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);
  if (loading) {
    return (
      <div className={pageBox} aria-busy="true">
        <div className="flex flex-wrap items-end gap-4">
          <div className="mr-auto flex flex-col gap-1">
            <h1 className={pageTitle}>Your boards</h1>
            <p className="text-sm text-muted">Loading…</p>
          </div>
        </div>
        <div role="status">
          <span className="sr-only">Loading boards</span>
          <ul className={gridClass} aria-hidden="true">
            {[0, 1, 2].map((n) => (
              <li
                key={n}
                className="flex min-h-[176px] flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm"
              >
                <div className={`${skel} size-11 rounded-xl`} />
                <div className="mt-auto flex flex-col gap-2">
                  <div className={`${skel} h-5 w-3/4 rounded-lg`} />
                  <div className={`${skel} h-3 w-1/3 rounded-lg`} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className={pageBox}>
        <ErrorMessage
          content="Couldn't find your boards. Please try again."
          linkText="Back to home"
          link=""
        />
      </div>
    );
  }
  return (
    <div className={pageBox}>
      <div className="flex flex-wrap items-end gap-4">
        <div className="mr-auto flex flex-col gap-1">
          <h1 className={pageTitle}>Your boards</h1>
          {boards.length > 0 && (
            <p className="text-sm text-muted">
              {boards.length === 1 ? "1 board" : `${boards.length} boards`}
            </p>
          )}
        </div>

        {boards.length > 0 && (
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className={`${btnBase} ${btnMd} ${btnBrand}`}
          >
            <Plus className="size-4" aria-hidden="true" />
            Create board
          </button>
        )}
      </div>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create board"
      >
        <CreateBoard
          onBoardCreated={(newBoard) => {
            setBoards((prev) => [...prev, newBoard]);
            setIsCreateOpen(false);
          }}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>
      <Modal
        isOpen={boardToDelete !== null}
        onClose={closeDeleteModal}
        title="Delete board?"
      >
        {boardToDelete && (
          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-content-center rounded-xl bg-danger-soft text-danger-text">
                <Trash2 className="size-5" aria-hidden="true" />
              </span>
              <p className="text-sm text-muted">
                Delete{" "}
                <span className="font-semibold text-fg">
                  {boardToDelete.title}
                </span>
                ? This also deletes its columns, cards and subtasks. You can't
                undo this.
              </p>
            </div>
            {deleteError && (
              <p role="alert" className={alertDanger}>
                <CircleAlert
                  className="mt-0.5 size-4 shrink-0"
                  aria-hidden="true"
                />
                {deleteError}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleting}
                className={`${btnBase} ${btnMd} ${btnSecondary} max-md:flex-1`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteBoard}
                disabled={deleting}
                className={`${btnBase} ${btnMd} ${btnDanger} max-md:flex-1`}
              >
                {deleting ? (
                  <>
                    <LoaderCircle
                      className="size-4 animate-spin motion-reduce:animate-none"
                      aria-hidden="true"
                    />
                    Deleting…
                  </>
                ) : (
                  <>
                    <Trash2 className="size-4" aria-hidden="true" />
                    Delete board
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {boards.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-[20px] border-2 border-dashed border-border-strong bg-surface px-6 py-[72px] text-center">
          <span className="grid size-16 place-content-center rounded-[18px] bg-primary-soft text-primary-text">
            <SquareKanban className="size-7" aria-hidden="true" />
          </span>
          <h2 className="font-display text-2xl leading-8 font-semibold tracking-tight text-fg">
            Start your first board
          </h2>
          <p className="max-w-[400px] text-[15px] leading-6 text-muted">
            A board holds one project. You'll get To Do, In Progress and Done
            columns to start — rename or add more anytime.
          </p>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className={`${btnBase} ${btnLg} ${btnBrand} mt-2`}
          >
            <Plus className="size-4" aria-hidden="true" />
            Create board
          </button>
        </div>
      ) : (
        <ul className={gridClass}>
          {boards.map((board) => (
            <li
              key={board.id}
              className="group relative transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <Link
                to={`/board/${board.id}`}
                className={`flex min-h-[176px] flex-col gap-4 rounded-2xl border border-border bg-surface p-5 pr-14 text-fg shadow-sm transition-[box-shadow,border-color] duration-200 group-hover:border-border-strong group-hover:shadow-md motion-reduce:transition-none ${focusRing}`}
              >
                <span className="grid size-11 place-content-center rounded-xl bg-primary-soft text-primary-text">
                  <SquareKanban className="size-5" aria-hidden="true" />
                </span>
                <div className="mt-auto flex flex-col gap-1">
                  <h2 className="font-display text-[17px] leading-6 font-semibold tracking-tight break-words text-fg">
                    {board.title}
                  </h2>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-text">
                    Open board
                    <ArrowRight
                      className="size-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setBoardToDelete(board)}
                aria-label={`Delete board ${board.title}`}
                className={`absolute top-3 right-3 ${btnBase} ${btnIconSm} ${btnGhostDanger}`}
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className={`flex min-h-[176px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border-strong text-sm font-semibold text-muted transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary-text motion-reduce:transition-none ${focusRing}`}
            >
              <Plus className="size-5" aria-hidden="true" />
              New board
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
