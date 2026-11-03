import { useEffect, useState } from "react";
import { getBoards } from "../services/boardService";
import { type Board } from "../entities/Boards";
import Loading from "../components/Loading";
import CreateBoard from "../components/CreateBoard";
import { Link } from "react-router";
import Modal from "../components/Modal";
import ErrorMessage from "../components/ErrorMessage";

const Dashboard = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    getBoards()
      .then((res) => setBoards(res))
      .catch((err) => {
        (console.log(err.message), setError(err));
      })
      .finally(() => setLoading(false));
  }, []);
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return (
      <ErrorMessage
        content="Couldn't find your boards. Please try again."
        linkText="HomePage"
        link="homepage"
      />
    );
  }
  return (
    <div className="mx-auto w-full max-w-5xl p-6">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Your <span className="text-blue-600">Boards</span>
        </h1>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          + Create board
        </button>
      </div>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create a new board"
      >
        <CreateBoard
          onBoardCreated={(newBoard) => {
            setBoards((prev) => [...prev, newBoard]);
            setIsCreateOpen(false);
          }}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>

      {boards.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">
          <p className="text-lg font-medium text-gray-600">
            You don't have any boards yet.
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Create your first board to get started.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board) => (
            <li key={board.id}>
              <Link
                to={`/board/${board.id}`}
                className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                  {board.title}
                </h2>
                <p className="mt-2 text-xs text-blue-600">Open board →</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
