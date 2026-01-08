import { useToast } from "~/hooks/use-toast";

import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:top-auto sm:right-0 sm:bottom-0 sm:flex-col md:max-w-[420px]">
      {toasts.map(function ({ id, title, description, action, variant, open, ...props }) {
        return (
          <div
            key={id}
            data-state={open ? "open" : "closed"}
            className={cn(
              "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
              "bg-background text-foreground",
              variant === "destructive" &&
                "destructive group border-destructive bg-destructive text-destructive-foreground",
              variant === "success" &&
                "border-green-500 bg-green-50 text-green-900 dark:bg-green-900 dark:text-green-100",

              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-bottom-full",

              "transition-transform duration-300 hover:rotate-0 data-[state=open]:rotate-1"
            )}
            {...props}
          >
            <div className="grid gap-1">
              {title && <div className="text-sm font-semibold">{title}</div>}
              {description && <div className="text-sm opacity-90">{description}</div>}
            </div>
            {action}
            <button
              onClick={() => dismiss(id)}
              className={cn(
                "text-foreground/50 hover:text-foreground absolute top-2 right-2 rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100 focus:ring-2 focus:outline-none",
                variant === "destructive" &&
                  "text-red-300 hover:text-red-50 focus:ring-red-400 focus:ring-offset-red-600",
                variant === "success" && "text-green-600 hover:text-green-800"
              )}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
