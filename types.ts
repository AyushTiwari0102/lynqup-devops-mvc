
export interface Creator {
  id?: string;
  name: string;
  role: string;
  category: string;
  price: string;
  image_url: string;
  is_approved?: boolean;
  // New execution-specific fields
  deployments?: number;
  reliability?: number;
  adherence?: number;
  skills?: string[];
  recent_loc?: string;
}

export interface EventRequest {
  event_name: string;
  event_date: string;
  location: string;
  brief: string;
  talent_names: string;
  status: 'pending' | 'active' | 'completed';
}

export type AppView = 'home' | 'request';
