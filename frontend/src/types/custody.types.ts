import { CustodyAction } from './constants';

export interface CustodyLog {
  id: string; case_id: string; evidence_id: string | null;
  action: CustodyAction; performed_by: string | null;
  performer_name: string | null; ip_address: string | null;
  notes: string | null; timestamp: string;
}
