export type ReadingOverview = {
  id: number;
  created_at: string;
  title: string;
  description: string;
  required_reading: boolean;
  content_id: string;
  revision_url: string;
  session_number: number;
  order: number;
  format: string;
};
