/**
 * VERIDACT — useAnalysis Hook
 * Manages analysis trigger, loading state, and result polling (stub — wired in Phase 5).
 */
import { useState } from 'react';
import type { AnalysisResult } from '@/types';

export function useAnalysis(evidenceId: string | undefined) {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerAnalysis = async () => {
    if (!evidenceId) return;
    // Stub — will be wired to real API in Phase 5
    setIsAnalyzing(false);
  };

  return { result, isAnalyzing, error, triggerAnalysis };
}

export default useAnalysis;
