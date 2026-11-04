import { useEffect, useState, type SubmitEvent } from "react";
import type { Subtask } from "../entities/Subtasks";
import {
  createSubtask,
  deleteSubtask,
  getSubtasks,
  toggleSubtask,
} from "../services/subtaskService";

interface Props {
  cardId: string;
}

const SubtaskList = ({ cardId }: Props) => {
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getSubtasks(cardId)
      .then((result) => {
        if (!cancelled) setSubtasks(result);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setError("Couldn't load subtasks.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [cardId]);

  const handleAdd = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title || adding) return;

    setAdding(true);
    setError(null);
    try {
      const position =
        subtasks.length === 0
          ? 0
          : Math.max(...subtasks.map((subtask) => subtask.position)) + 1;
      const created = await createSubtask({ cardId, title, position });
      setSubtasks((prev) => [...prev, created]);
      setNewTitle("");
    } catch (err) {
      console.error(err);
      setError("Couldn't add the subtask. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (subtask: Subtask) => {
    setError(null);
    try {
      const updated = await toggleSubtask(subtask.id, !subtask.is_done);
      setSubtasks((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (err) {
      console.error(err);
      setError("Couldn't update the subtask. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await deleteSubtask(id);
      setSubtasks((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      setError("Couldn't delete the subtask. Please try again.");
    }
  };

  const doneCount = subtasks.filter((subtask) => subtask.is_done).length;

  return (
    <div className="space-y-3 border-t border-gray-200 pt-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">Subtasks</h4>
        {subtasks.length > 0 && (
          <span className="text-xs text-gray-500">
            {doneCount}/{subtasks.length} done
          </span>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : (
        <ul className="space-y-1">
          {subtasks.map((subtask) => (
            <li key={subtask.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={subtask.is_done}
                onChange={() => handleToggle(subtask)}
                className="h-4 w-4 cursor-pointer"
              />
              <span
                className={`flex-1 text-sm ${
                  subtask.is_done
                    ? "text-gray-400 line-through"
                    : "text-gray-800"
                }`}
              >
                {subtask.title}
              </span>
              <button
                type="button"
                onClick={() => handleDelete(subtask.id)}
                aria-label={`Delete subtask ${subtask.title}`}
                className="px-1 text-gray-400 hover:text-red-600"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a subtask"
          className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400"
        />
        <button
          type="submit"
          disabled={adding || !newTitle.trim()}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default SubtaskList;
