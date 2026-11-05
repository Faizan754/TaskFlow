import { useAuth } from "../context/AuthContext";
import { createBoard } from "../services/boardService";
import { type Board } from "../entities/Boards";
import EntityForm from "./EntityForm";

interface Props {
  onBoardCreated: (board: Board) => void;
  onCancel?: () => void;
}

const CreateBoard = ({ onBoardCreated, onCancel }: Props) => {
  const { user } = useAuth();

  // Dashboard sits behind ProtectedRoute, so this is only a type guard.
  if (!user) return null;

  return (
    <EntityForm
      label="Board name"
      titlePlaceholder="e.g. Fitness plan"
      submitLabel="Create board"
      submittingLabel="Creating…"
      errorMessage="Couldn't create the board. Please try again."
      onCancel={onCancel}
      onSubmit={async ({ title }) => {
        const board = await createBoard({ userId: user.id, title });
        onBoardCreated(board);
      }}
    />
  );
};

export default CreateBoard;
