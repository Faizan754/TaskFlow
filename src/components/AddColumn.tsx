import { useState } from "react";
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
        className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-sm font-semibold text-gray-500 hover:border-gray-400 hover:text-gray-700 md:w-64 md:flex-none md:self-start"
      >
        + Add column
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:w-64 md:flex-none md:self-start">
      <EntityForm
        titlePlaceholder="Column title"
        submitLabel="Add"
        submittingLabel="Adding..."
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
