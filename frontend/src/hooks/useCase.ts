/**
 * VERIDACT — useCase Hook
 * Fetches a single case by ID (stub — wired in Phase 4).
 */
import { useState, useEffect } from 'react';
import type { Case } from '@/types';

export function useCase(caseId: string | undefined) {
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!caseId) {
      setIsLoading(false);
      return;
    }
    // Stub — will be wired to real API in Phase 4
    setIsLoading(false);
  }, [caseId]);

  return { caseData, setCaseData, isLoading, error };
}

export default useCase;
