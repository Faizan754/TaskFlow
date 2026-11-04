import { useId, useState, type ReactNode, type SubmitEvent } from "react";

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

const inputClasses =
  "block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={titleId}
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <input
          id={titleId}
          className={inputClasses}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={titlePlaceholder}
          autoFocus
          required
        />
        {showDescription && (
          <textarea
            className={inputClasses}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
          />
        )}
        {extraFields}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? submittingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default EntityForm;
