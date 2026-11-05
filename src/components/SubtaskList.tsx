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
import {
  ChevronDown,
  CircleAlert,
  ListChecks,
  LoaderCircle,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import {
  alertDanger,
  brandGradient,
  btnBase,
  btnBrand,
  btnGhost,
  btnIconSm,
  btnMd,
  btnSecondary,
  fieldError,
  inputFlex,
  inputFlexSm,
  sectionHeading,
  selectSm,
  skel,
} from "../lib/ui";

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
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <h4 className={sectionHeading}>
          <ListChecks className="size-4 text-muted" aria-hidden="true" />
          Subtasks
        </h4>
        {subtasks.length > 0 && (
          <span className="ml-auto text-xs font-semibold text-muted">
            {doneCount}/{subtasks.length} done
          </span>
        )}
      </div>

      {subtasks.length > 0 && (
        <div
          role="progressbar"
          aria-label="Subtasks complete"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round((doneCount / subtasks.length) * 100)}
          className="h-1.5 overflow-hidden rounded-full bg-surface-sunken"
        >
          <div
            className="h-full rounded-full bg-linear-90 from-[#1a6bff] to-[#4b2ae8] transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${(doneCount / subtasks.length) * 100}%` }}
          />
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : (
        <ul className="flex flex-col gap-0.5">
          {subtasks.map((subtask) => (
            <li
              key={subtask.id}
              className="flex min-h-10 items-center gap-2.5 rounded-[10px] pr-1.5 pl-2 hover:bg-surface-sunken max-md:min-h-11"
            >
              <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 self-stretch">
                <input
                  type="checkbox"
                  checked={subtask.is_done}
                  onChange={() => handleToggle(subtask)}
                  className="size-5 shrink-0 cursor-pointer accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                />
                <span
                  className={
                    subtask.is_done
                      ? "min-w-0 break-words text-sm text-muted line-through"
                      : "min-w-0 break-words text-sm text-fg"
                  }
                >
                  {subtask.title}
                </span>
              </label>
              <button
                type="button"
                onClick={() => handleDelete(subtask.id)}
                aria-label={`Delete subtask ${subtask.title}`}
                className={`${btnBase} ${btnIconSm} ${btnGhost}`}
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p className={fieldError}>
          <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a subtask…"
          aria-label="New subtask"
          className={inputFlex}
        />
        <button
          type="submit"
          disabled={adding || !newTitle.trim()}
          className={`${btnBase} ${btnMd} ${btnSecondary}`}
        >
          <Plus className="size-4" aria-hidden="true" />
          Add
        </button>
      </form>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-sunken p-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <span
            aria-hidden="true"
            className={`grid size-8 place-content-center rounded-[10px] ${brandGradient} text-white`}
          >
            <Sparkles className="size-4" />
          </span>
          <div className="mr-auto flex flex-col">
            <span className="text-[13px] leading-[18px] font-semibold text-fg">
              AI subtask ideas
            </span>
            <span className="text-xs text-muted">
              Based on the title and description.
            </span>
          </div>
          <div className="relative w-32">
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as LlmProvider)}
              aria-label="AI provider"
              className={selectSm}
            >
              <option value="gemini">Gemini</option>
              <option value="groq">Groq</option>
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
          </div>
          <button
            type="button"
            onClick={handleSuggest}
            disabled={suggesting}
            className={`${btnBase} ${btnMd} ${btnSecondary}`}
          >
            {suggesting ? (
              <LoaderCircle
                className="size-4 animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
            ) : (
              <Sparkles className="size-4" aria-hidden="true" />
            )}
            {suggesting ? "Thinking…" : "Suggest subtasks"}
          </button>
        </div>

        {suggesting && (
          <div aria-hidden="true" className="flex flex-col gap-2.5">
            <div className={`${skel} h-9 w-full rounded-[10px]`} />
            <div className={`${skel} h-9 w-[85%] rounded-[10px]`} />
            <div className={`${skel} h-9 w-[70%] rounded-[10px]`} />
          </div>
        )}

        {aiError && (
          <p role="alert" className={alertDanger}>
            <CircleAlert
              className="mt-0.5 size-4 shrink-0"
              aria-hidden="true"
            />
            {aiError}
          </p>
        )}

        {suggestions.length > 0 && (
          <>
            <p className="text-xs text-muted">
              Edit any line before adding. Unchecked ones are skipped.
            </p>
            <ul className="flex flex-col gap-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-center gap-2.5">
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
                    aria-label={`Include: ${suggestion.text}`}
                    className="size-5 shrink-0 cursor-pointer accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
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
                    aria-label={`Edit suggestion ${index + 1}`}
                    className={inputFlexSm}
                  />
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSuggestions([])}
                className={`${btnBase} ${btnMd} ${btnGhost}`}
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleAcceptSuggestions}
                disabled={savingSuggestions || selectedTitles.length === 0}
                className={`${btnBase} ${btnMd} ${btnBrand}`}
              >
                {savingSuggestions ? (
                  <LoaderCircle
                    className="size-4 animate-spin motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                ) : (
                  <Plus className="size-4" aria-hidden="true" />
                )}
                {savingSuggestions
                  ? "Adding…"
                  : `Add selected (${selectedTitles.length})`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubtaskList;
