import type { ReactNode } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { X } from "lucide-react";
import { btnBase, btnGhost, btnIcon } from "../lib/ui";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "md" | "lg";
};

const panelClasses: Record<"md" | "lg", string> = {
  md: "relative flex max-h-full w-full max-w-[560px] animate-[tf-dialog-in_160ms_ease-out] flex-col overflow-y-auto rounded-[20px] border border-border bg-surface text-fg shadow-lg motion-reduce:animate-none max-md:max-w-none max-md:rounded-b-none max-md:border-b-0",
  lg: "relative flex max-h-full w-full max-w-[820px] animate-[tf-dialog-in_160ms_ease-out] flex-col overflow-y-auto rounded-[20px] border border-border bg-surface text-fg shadow-lg motion-reduce:animate-none max-md:max-w-none max-md:rounded-b-none max-md:border-b-0",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  return (
    <Dialog open={isOpen} onClose={() => onClose()} className="relative z-[60]">
      <DialogBackdrop className="fixed inset-0 animate-[tf-fade-in_160ms_ease-out] bg-overlay motion-reduce:animate-none" />
      <div className="fixed inset-0 flex items-center justify-center p-10 max-md:items-end max-md:p-0 max-md:pt-8">
        <DialogPanel className={panelClasses[size]}>
          <div
            aria-hidden="true"
            className="mx-auto mt-2 h-1 w-10 rounded-full bg-border-strong md:hidden"
          />
          <div className="flex items-start gap-3 pt-5 pr-16 pl-6 max-md:pt-3 max-md:pr-14 max-md:pl-4">
            {title && (
              <DialogTitle
                as="h2"
                className="flex-1 pt-1.5 font-display text-lg font-semibold tracking-tight text-fg"
              >
                {title}
              </DialogTitle>
            )}
          </div>
          <div className="px-6 pt-4 pb-5 max-md:px-4 max-md:pt-3 max-md:pb-4">
            {children}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`${btnBase} ${btnIcon} ${btnGhost} absolute top-4 right-4 max-md:top-2 max-md:right-2`}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
