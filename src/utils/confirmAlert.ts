import Swal from "sweetalert2";

interface ConfirmOptions {
  title?: string;
  text?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  icon?: "warning" | "error" | "success" | "info" | "question";
}

/**
 * Global reusable SweetAlert confirmation modal for delete actions.
 * Returns true if confirmed, false otherwise.
 */
export const confirmDelete = async (options?: ConfirmOptions): Promise<boolean> => {
  const result = await Swal.fire({
    title: options?.title || "Are you sure?",
    text: options?.text || "This action cannot be undone!",
    icon: options?.icon || "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444", // Modern Tailwind Rose Red
    cancelButtonColor: "#64748b",  // Modern Tailwind Slate
    confirmButtonText: options?.confirmButtonText || "Yes, Delete",
    cancelButtonText: options?.cancelButtonText || "Cancel",
    reverseButtons: true,
    customClass: {
      popup: "rounded-3xl p-6 font-sans border border-slate-100 shadow-2xl",
      title: "text-lg font-black text-[#00062A]",
      htmlContainer: "text-xs font-semibold text-slate-500",
      confirmButton: "px-5 py-2.5 rounded-xl text-xs font-black shadow-md border-none cursor-pointer",
      cancelButton: "px-5 py-2.5 rounded-xl text-xs font-black border-none cursor-pointer",
    },
  });

  return result.isConfirmed;
};

/**
 * Generic reusable SweetAlert confirmation modal for any action.
 */
export const confirmAction = async (options: ConfirmOptions): Promise<boolean> => {
  const result = await Swal.fire({
    title: options.title || "Confirm Action",
    text: options.text || "Are you sure you want to proceed?",
    icon: options.icon || "question",
    showCancelButton: true,
    confirmButtonColor: "#FF4C00", // Brand primary
    cancelButtonColor: "#64748b",
    confirmButtonText: options.confirmButtonText || "Confirm",
    cancelButtonText: options.cancelButtonText || "Cancel",
    reverseButtons: true,
    customClass: {
      popup: "rounded-3xl p-6 font-sans border border-slate-100 shadow-2xl",
      title: "text-lg font-black text-[#00062A]",
      htmlContainer: "text-xs font-semibold text-slate-500",
      confirmButton: "px-5 py-2.5 rounded-xl text-xs font-black shadow-md border-none cursor-pointer",
      cancelButton: "px-5 py-2.5 rounded-xl text-xs font-black border-none cursor-pointer",
    },
  });

  return result.isConfirmed;
};
