import { useId, useState, type ReactNode, type SubmitEvent } from "react";
import { CircleAlert, LoaderCircle } from "lucide-react";
import {
  btnBase,
  btnMd,
  btnPrimary,
  btnSecondary,
  fieldError,
  input,
  label as labelClass,
  textarea,
} from "../lib/ui";

export interface EntityFormValues {
  title: string;
  description: string;
}

interface Props {
  label?: string;
  titlePlaceholder: string;
  submitLabel: string;
  submittingLabel?: string;
  showDescription?: boolean;
  errorMessage?: string;
  initialTitle?: string;
  initialDescription?: string;
  resetOnSuccess?: boolean;
  extraFields?: ReactNode;
  onSubmit: (values: EntityFormValues) => Promise<void>;
  onCancel?: () => void;
}

const EntityForm = ({
  label,
  titlePlaceholder,
  submitLabel,
  submittingLabel = "Saving...",
  showDescription = false,
  errorMessage = "Something went wrong. Please try again.",
  initialTitle = "",
  initialDescription = "",
  resetOnSuccess = true,
  extraFields,
  onSubmit,
  onCancel,
}: Props) => {
  const titleId = useId();
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        title: trimmedTitle,
        description: description.trim(),
      });
      if (resetOnSuccess) {
        setTitle("");
        setDescription("");
      }
    } catch (err) {
      console.error(err);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={titleId} className={labelClass}>
            {label}
          </label>
        )}
        <input
          id={titleId}
          className={input}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={titlePlaceholder}
          autoFocus
          required
          aria-describedby={error ? `${titleId}-error` : undefined}
        />
        {showDescription && (
          <textarea
            className={textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
          />
        )}
        {extraFields}
        {error && (
          <p id={`${titleId}-error`} className={fieldError}>
            <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={`${btnBase} ${btnMd} ${btnSecondary} max-md:flex-1`}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className={`${btnBase} ${btnMd} ${btnPrimary} max-md:flex-1`}
        >
          {isSubmitting && (
            <LoaderCircle
              className="size-4 animate-spin motion-reduce:animate-none"
              aria-hidden="true"
            />
          )}
          {isSubmitting ? submittingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default EntityForm;
