import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchUserProjects,
  createProject,
  deleteProject,
  type Project,
} from '@/services/projects.service';
import { supabase } from '@/lib/supabase';
import type { Json } from '@/lib/supabase/database.types';
import { DEFAULT_TOKENS } from '@/lib/default-tokens';
import { useAuth } from '@/providers';

export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: fetchUserProjects,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: { name: string; description?: string; teamIds?: string[]; userIds?: string[] }) => {
      // Create the project
      const project = await createProject({
        name: data.name,
        description: data.description ?? null,
        owner_id: user!.id,
        tokens_data: DEFAULT_TOKENS as unknown as Json,
      });

      // Add individual users as project members
      const userIds = new Set<string>(data.userIds ?? []);

      // Expand team members into user IDs
      if (data.teamIds && data.teamIds.length > 0) {
        const { data: teamMembers } = await supabase
          .from('team_members')
          .select('user_id')
          .in('team_id', data.teamIds);

        if (teamMembers) {
          teamMembers.forEach((tm) => userIds.add(tm.user_id));
        }
      }

      // Remove owner from the list (already has access)
      userIds.delete(user!.id);

      // Add all members in parallel
      if (userIds.size > 0) {
        const inserts = Array.from(userIds).map((userId) => ({
          project_id: project.id,
          user_id: userId,
          role: 'editor',
        }));

        await supabase.from('project_members').insert(inserts);
      }

      return project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
