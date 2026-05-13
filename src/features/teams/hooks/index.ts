import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAllTeams,
  fetchTeamWithMembers,
  createTeam,
  updateTeam,
  deleteTeam,
  addTeamMember,
  removeTeamMember,
  fetchTeamsForSelect,
  fetchUsersForSelect,
  findUserByEmail,
} from '../services';
import { useAuth } from '@/providers';

export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: fetchAllTeams,
  });
}

export function useTeamWithMembers(teamId: string | null) {
  return useQuery({
    queryKey: ['teams', teamId, 'members'],
    queryFn: () => fetchTeamWithMembers(teamId!),
    enabled: !!teamId,
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      createTeam({
        name: data.name,
        description: data.description,
        created_by: user!.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}

export function useUpdateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, data }: { teamId: string; data: { name?: string; description?: string | null } }) =>
      updateTeam(teamId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}

export function useDeleteTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (teamId: string) => deleteTeam(teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}

export function useAddTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, userId }: { teamId: string; userId: string }) =>
      addTeamMember(teamId, userId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['teams', variables.teamId, 'members'] });
    },
  });
}

export function useRemoveTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, userId }: { teamId: string; userId: string }) =>
      removeTeamMember(teamId, userId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['teams', variables.teamId, 'members'] });
    },
  });
}

export function useTeamsForSelect() {
  return useQuery({
    queryKey: ['teams', 'select'],
    queryFn: fetchTeamsForSelect,
  });
}

export function useUsersForSelect() {
  return useQuery({
    queryKey: ['users', 'select'],
    queryFn: fetchUsersForSelect,
  });
}

/**
 * One-shot lookup of a user by exact email.
 * Used by team-owners (non-admin) to find members to add.
 */
export function useFindUserByEmail() {
  return useMutation({
    mutationFn: (email: string) => findUserByEmail(email),
  });
}
