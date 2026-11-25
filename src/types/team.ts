export interface Team {
  id: string;
  name: string;
  description?: string;
  leadId: string;
  leadName?: string;
  memberCount: number;
  memberIds: string[];
  createdAt: string;
  updatedAt: string;
}
