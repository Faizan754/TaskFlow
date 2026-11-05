import { LoaderCircle } from "lucide-react";

const Loading = () => {
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center"
      role="status"
    >
      <LoaderCircle
        className="size-8 animate-spin text-primary motion-reduce:animate-none"
        aria-hidden="true"
      />
      <p className="mt-3 text-sm font-medium text-muted">Loading…</p>
    </div>
  );
};

export default Loading;
