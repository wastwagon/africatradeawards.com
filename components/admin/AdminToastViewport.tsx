'use client'

import AdminToast from "@/components/admin/AdminToast";
import { type AdminToastItem } from "@/components/admin/useAdminToastQueue";

type AdminToastViewportProps = {
  toasts: AdminToastItem[];
  onClose: (id: number) => void;
};

export default function AdminToastViewport({ toasts, onClose }: AdminToastViewportProps) {
  return (
    <>
      {toasts.map((toast, index) => (
        <AdminToast
          key={toast.id}
          kind={toast.kind}
          message={toast.message}
          onClose={() => onClose(toast.id)}
          style={{ bottom: `${18 + index * 72}px` }}
        />
      ))}
    </>
  );
}
