/**
 * VERIDACT — Public Service
 * Handles citizen-facing public API calls (no auth required).
 */
import apiClient from './apiClient';

/**
 * Track a case by its public case number.
 */
export const trackCase = async (caseNumber: string) => {
  const response = await apiClient.get(`/public/cases/${caseNumber}`);
  return response.data;
};

export default { trackCase };
