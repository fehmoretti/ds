export interface MetricCard {
  id: string;
  title: string;
  value: string;
  description: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed' | 'archived';
  owner: string;
  updatedAt: string;
  progress: number;
}

export interface CreateProjectFormData {
  name: string;
  description: string;
  category: string;
  priority: string;
}
