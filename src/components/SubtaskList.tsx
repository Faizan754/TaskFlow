import { useEffect, useState, type SubmitEvent } from "react";
import type { Subtask } from "../entities/Subtasks";
import {
  createSubtask,
  createSubtasks,
  deleteSubtask,
  getSubtasks,
  toggleSubtask,
} from "../services/subtaskService";
import { suggestSubtasks, type LlmProvider } from "../services/aiService";

interface Props {
  cardId: string;
  cardTitle: string;
  cardDescription: string | null;
}

interface Suggestion {
  text: string;
  checked: boolean;
}

const SubtaskList = ({ cardId, cardTitle, cardDescription }: Props) => {
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);

  const [provider, setProvider] = useState<LlmProvider>("gemini");
  const [suggesting, setSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [savingSuggestions, setSavingSuggestions] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

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

  const nextPosition =
    subtasks.length === 0
      ? 0
      : Math.max(...subtasks.map((subtask) => subtask.position)) + 1;

  const handleAdd = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title || adding) return;

    setAdding(true);
    setError(null);
    try {
      const created = await createSubtask({
        cardId,
        title,
        position: nextPosition,
      });
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

  const handleSuggest = async () => {
    setSuggesting(true);
    setAiError(null);
    try {
      const result = await suggestSubtasks({
        title: cardTitle,
        description: cardDescription,
        provider,
      });
      setSuggestions(result.map((text) => ({ text, checked: true })));
    } catch (err) {
      console.error(err);
      setAiError(
        "Couldn't get suggestions right now. Please try again in a moment.",
      );
    } finally {
      setSuggesting(false);
    }
  };

  const selectedTitles = suggestions
    .filter((suggestion) => suggestion.checked)
    .map((suggestion) => suggestion.text.trim())
    .filter(Boolean);

  const handleAcceptSuggestions = async () => {
    if (selectedTitles.length === 0 || savingSuggestions) return;

    setSavingSuggestions(true);
    setAiError(null);
    try {
      const created = await createSubtasks({
        cardId,
        titles: selectedTitles,
        startPosition: nextPosition,
      });
      setSubtasks((prev) => [...prev, ...created]);
      setSuggestions([]);
    } catch (err) {
      console.error(err);
      setAiError("Couldn't save the suggestions. Please try again.");
    } finally {
      setSavingSuggestions(false);
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

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as LlmProvider)}
            aria-label="AI provider"
            className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900"
          >
            <option value="gemini">Gemini</option>
            <option value="groq">Groq</option>
          </select>
          <button
            type="button"
            onClick={handleSuggest}
            disabled={suggesting}
            className="rounded-md border border-blue-600 px-3 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 disabled:opacity-50"
          >
            {suggesting ? "Thinking..." : "Suggest subtasks"}
          </button>
        </div>

        {aiError && <p className="text-xs text-red-600">{aiError}</p>}

        {suggestions.length > 0 && (
          <div className="space-y-2 rounded-md border border-blue-200 bg-blue-50 p-3">
            <p className="text-xs font-semibold text-blue-800">
              Suggestions: edit or untick before adding
            </p>
            <ul className="space-y-1">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={suggestion.checked}
                    onChange={() =>
                      setSuggestions((prev) =>
                        prev.map((item, i) =>
                          i === index
                            ? { ...item, checked: !item.checked }
                            : item,
                        ),
                      )
                    }
                    className="h-4 w-4 cursor-pointer"
                  />
                  <input
                    value={suggestion.text}
                    onChange={(e) =>
                      setSuggestions((prev) =>
                        prev.map((item, i) =>
                          i === index
                            ? { ...item, text: e.target.value }
                            : item,
                        ),
                      )
                    }
                    className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900"
                  />
                </li>
              ))}
            </ul>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSuggestions([])}
                className="rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-white"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleAcceptSuggestions}
                disabled={savingSuggestions || selectedTitles.length === 0}
                className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {savingSuggestions
                  ? "Adding..."
                  : `Add selected (${selectedTitles.length})`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubtaskList;
