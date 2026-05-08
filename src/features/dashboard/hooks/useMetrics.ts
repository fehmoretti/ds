import { useQuery } from '@tanstack/react-query';
import { fetchMetrics } from '../services';

export function useMetrics() {
  return useQuery({
    queryKey: ['metrics'],
    queryFn: fetchMetrics,
  });
}
