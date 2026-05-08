import { supabase } from '@/lib/supabase';
import type { MetricCard, ProjectItem } from '../types';

// Simulated data for demonstration - in production these would be real Supabase queries
// All queries use the authenticated user's session token for RLS enforcement

const MOCK_METRICS: MetricCard[] = [
  {
    id: '1',
    title: 'Projetos Ativos',
    value: '12',
    description: 'Total de projetos em andamento',
    trend: 'up',
    trendValue: '+2 este mês',
  },
  {
    id: '2',
    title: 'Tarefas Concluídas',
    value: '48',
    description: 'Tarefas finalizadas esta semana',
    trend: 'up',
    trendValue: '+12% vs semana anterior',
  },
  {
    id: '3',
    title: 'Membros da Equipe',
    value: '8',
    description: 'Pessoas ativas no workspace',
    trend: 'neutral',
    trendValue: 'Sem alteração',
  },
  {
    id: '4',
    title: 'Tempo Médio',
    value: '3.2d',
    description: 'Tempo médio por tarefa',
    trend: 'down',
    trendValue: '-0.5d vs mês anterior',
  },
];

const MOCK_PROJECTS: ProjectItem[] = [
  {
    id: '1',
    name: 'Redesign do Dashboard',
    status: 'active',
    owner: 'Maria Silva',
    updatedAt: '2026-05-05',
    progress: 65,
  },
  {
    id: '2',
    name: 'API de Integração',
    status: 'active',
    owner: 'João Santos',
    updatedAt: '2026-05-04',
    progress: 40,
  },
  {
    id: '3',
    name: 'Documentação v2',
    status: 'paused',
    owner: 'Ana Costa',
    updatedAt: '2026-05-01',
    progress: 80,
  },
  {
    id: '4',
    name: 'Migração de Banco',
    status: 'completed',
    owner: 'Carlos Lima',
    updatedAt: '2026-04-28',
    progress: 100,
  },
  {
    id: '5',
    name: 'Testes E2E',
    status: 'archived',
    owner: 'Pedro Oliveira',
    updatedAt: '2026-04-20',
    progress: 100,
  },
];

export async function fetchMetrics(): Promise<MetricCard[]> {
  // Example of how a real query would look with RLS:
  // const { data, error } = await supabase
  //   .from('metrics')
  //   .select('*')
  //   .order('created_at', { ascending: false });
  //
  // if (error) throw new Error('Falha ao carregar métricas');
  // return data;

  // Verify Supabase client is initialized (validates env vars)
  void supabase;

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return MOCK_METRICS;
}

export async function fetchProjects(): Promise<ProjectItem[]> {
  // Example of how a real query would look with RLS:
  // const { data, error } = await supabase
  //   .from('projects')
  //   .select('id, name, status, owner, updated_at, progress')
  //   .order('updated_at', { ascending: false });
  //
  // if (error) throw new Error('Falha ao carregar projetos');
  // return data;

  void supabase;

  await new Promise((resolve) => setTimeout(resolve, 1000));
  return MOCK_PROJECTS;
}

export async function createProject(
  data: Pick<ProjectItem, 'name'> & { description: string; category: string; priority: string },
): Promise<ProjectItem> {
  // Example of how a real insert would look with RLS:
  // const { data: project, error } = await supabase
  //   .from('projects')
  //   .insert({
  //     name: data.name,
  //     description: data.description,
  //     category: data.category,
  //     priority: data.priority,
  //   })
  //   .select()
  //   .single();
  //
  // if (error) throw new Error('Falha ao criar projeto');
  // return project;

  void supabase;

  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    id: crypto.randomUUID(),
    name: data.name,
    status: 'active',
    owner: 'Usuário Atual',
    updatedAt: new Date().toISOString().split('T')[0] ?? '',
    progress: 0,
  };
}
