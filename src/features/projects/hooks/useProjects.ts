import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchUserProjects,
  createProject,
  deleteProject,
  syncProjectMembers,
  uploadProjectLogo,
  type ProjectWithOwner,
} from '@/services/projects.service';
import type { Json } from '@/lib/supabase/database.types';
import { DEFAULT_TOKENS } from '@/lib/default-tokens';
import { useAuth } from '@/providers';

export function useProjects() {
  return useQuery<ProjectWithOwner[]>({
    queryKey: ['projects'],
    queryFn: fetchUserProjects,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: { name: string; description?: string; teamIds?: string[]; userIds?: string[]; logoFile?: File }) => {
      const project = await createProject({
        name: data.name,
        description: data.description ?? null,
        owner_id: user!.id,
        tokens_data: DEFAULT_TOKENS as unknown as Json,
      });

      await syncProjectMembers(
        project.id,
        user!.id,
        data.teamIds ?? [],
        data.userIds ?? [],
      );

      if (data.logoFile) {
        await uploadProjectLogo(project.id, data.logoFile);
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
