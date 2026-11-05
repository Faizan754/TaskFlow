import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { btnBase, btnGhost, btnIcon } from "../lib/ui";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex animate-[tf-fade-in_160ms_ease-out] items-center justify-center bg-overlay p-10 motion-reduce:animate-none max-md:items-end max-md:p-0 max-md:pt-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative flex max-h-full w-full max-w-[560px] animate-[tf-dialog-in_160ms_ease-out] flex-col overflow-y-auto rounded-[20px] border border-border bg-surface text-fg shadow-lg motion-reduce:animate-none max-md:max-w-none max-md:rounded-b-none max-md:border-b-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          aria-hidden="true"
          className="mx-auto mt-2 h-1 w-10 rounded-full bg-border-strong md:hidden"
        />
        <div className="flex items-start gap-3 pt-5 pr-5 pl-6 max-md:px-4 max-md:pt-3">
          {title && (
            <h2 className="flex-1 pt-1.5 font-display text-lg font-semibold tracking-tight text-fg">
              {title}
            </h2>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`${btnBase} ${btnIcon} ${btnGhost} ml-auto`}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="px-6 pt-4 pb-5 max-md:px-4 max-md:pt-3 max-md:pb-4">
          {children}
        </div>
      </div>
    </div>
  );
}
