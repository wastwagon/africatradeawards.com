'use client'

import { useEffect, useState } from "react";
import useAdminToastQueue from "@/components/admin/useAdminToastQueue";

export default function useAdminFeedback() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toasts, pushToast, dismissToast } = useAdminToastQueue();

  useEffect(() => {
    if (!successMessage) return;
    pushToast("success", successMessage);
    setSuccessMessage(null);
  }, [pushToast, successMessage]);

  useEffect(() => {
    if (!errorMessage) return;
    pushToast("error", errorMessage);
    setErrorMessage(null);
  }, [errorMessage, pushToast]);

  const clearFeedback = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  return {
    toasts,
    dismissToast,
    successMessage,
    errorMessage,
    setSuccessMessage,
    setErrorMessage,
    clearFeedback,
  };
}
