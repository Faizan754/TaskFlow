import { useState } from "react";
import { Plus } from "lucide-react";
import { createColumn } from "../services/columnService";
import type { Column } from "../entities/Columns";
import EntityForm from "./EntityForm";

interface Props {
  boardId: string;
  position: number;
  onColumnCreated: (column: Column) => void;
}

const AddColumn = ({ boardId, position, onColumnCreated }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex min-h-[120px] w-[304px] shrink-0 snap-start cursor-pointer items-center justify-center gap-2 self-start rounded-2xl border-2 border-dashed border-border-strong text-sm font-semibold text-muted transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary-text motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        <Plus aria-hidden="true" className="size-4" />
        Add column
      </button>
    );
  }

  return (
    <div className="w-[304px] shrink-0 snap-start self-start rounded-2xl border border-border bg-surface-sunken p-2.5">
      <EntityForm
        titlePlaceholder="Column title"
        submitLabel="Add column"
        submittingLabel="Adding…"
        errorMessage="Couldn't add the column. Please try again."
        onCancel={() => setIsOpen(false)}
        onSubmit={async ({ title }) => {
          const column = await createColumn({ boardId, title, position });
          onColumnCreated(column);
          setIsOpen(false);
        }}
      />
    </div>
  );
};

export default AddColumn;
