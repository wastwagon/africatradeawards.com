'use client'

import { useCallback, useMemo, useState } from "react";

export default function useAdminAsyncAction() {
  const [pendingCount, setPendingCount] = useState(0);

  const withBusy = useCallback(async <T>(task: () => Promise<T>): Promise<T> => {
    setPendingCount((current) => current + 1);
    try {
      return await task();
    } finally {
      setPendingCount((current) => Math.max(0, current - 1));
    }
  }, []);

  const isBusy = useMemo(() => pendingCount > 0, [pendingCount]);

  return { isBusy, withBusy };
}
