import { supabase, type Tables } from '@/lib/supabase';

export type Team = Tables<'teams'>;
export type TeamMember = Tables<'team_members'>;

export interface TeamWithMembers extends Team {
  members: (TeamMember & { profile: Tables<'profiles'> })[];
}

/**
 * Fetch all teams (admin only via RLS)
 */
export async function fetchAllTeams(): Promise<Team[]> {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    throw new Error('Não foi possível carregar as equipes.');
  }

  return data;
}

/**
 * Fetch a single team with its members
 */
export async function fetchTeamWithMembers(teamId: string): Promise<TeamWithMembers> {
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .select('*')
    .eq('id', teamId)
    .single();

  if (teamError) {
    throw new Error('Equipe não encontrada.');
  }

  const { data: members, error: membersError } = await supabase
    .from('team_members')
    .select('*, profile:profiles(*)')
    .eq('team_id', teamId);

  if (membersError) {
    throw new Error('Não foi possível carregar os membros da equipe.');
  }

  return {
    ...team,
    members: members as (TeamMember & { profile: Tables<'profiles'> })[],
  };
}

/**
 * Create a new team
 */
export async function createTeam(params: {
  name: string;
  description?: string;
  created_by: string;
}): Promise<Team> {
  const { data, error } = await supabase
    .from('teams')
    .insert({
      name: params.name,
      description: params.description || null,
      created_by: params.created_by,
    })
    .select()
    .single();

  if (error) {
    throw new Error('Não foi possível criar a equipe.');
  }

  return data;
}

/**
 * Update a team
 */
export async function updateTeam(
  teamId: string,
  data: { name?: string; description?: string | null },
): Promise<void> {
  const { error } = await supabase
    .from('teams')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', teamId);

  if (error) {
    throw new Error('Não foi possível atualizar a equipe.');
  }
}

/**
 * Delete a team
 */
export async function deleteTeam(teamId: string): Promise<void> {
  const { error } = await supabase
    .from('teams')
    .delete()
    .eq('id', teamId);

  if (error) {
    throw new Error('Não foi possível excluir a equipe.');
  }
}

/**
 * Add a user to a team
 */
export async function addTeamMember(teamId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('team_members')
    .insert({ team_id: teamId, user_id: userId });

  if (error) {
    if (error.code === '23505') {
      throw new Error('Este usuário já pertence à equipe.');
    }
    throw new Error('Não foi possível adicionar o membro.');
  }
}

/**
 * Remove a user from a team
 */
export async function removeTeamMember(teamId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('team_id', teamId)
    .eq('user_id', userId);

  if (error) {
    throw new Error('Não foi possível remover o membro.');
  }
}

/**
 * Fetch all teams (for project assignment - accessible by all users)
 */
export async function fetchTeamsForSelect(): Promise<{ value: string; label: string }[]> {
  const { data, error } = await supabase
    .from('teams')
    .select('id, name')
    .order('name', { ascending: true });

  if (error) {
    throw new Error('Não foi possível carregar equipes.');
  }

  return data.map((t) => ({ value: t.id, label: t.name }));
}

/**
 * Fetch all users for select (used in team member addition and project assignment)
 */
export async function fetchUsersForSelect(): Promise<{ value: string; label: string; description: string }[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('active', true)
    .order('full_name', { ascending: true });

  if (error) {
    throw new Error('Não foi possível carregar usuários.');
  }

  return data.map((u) => ({
    value: u.id,
    label: u.full_name,
    description: u.email,
  }));
}

export interface UserSearchResult {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
}

/**
 * Find an active user by exact email (case-insensitive).
 * Uses a SECURITY DEFINER RPC so common users can look up other users
 * without exposing the full profiles table.
 */
export async function findUserByEmail(email: string): Promise<UserSearchResult | null> {
  const normalized = email.trim();
  if (!normalized) return null;

  const { data, error } = await supabase.rpc('find_user_by_email', {
    p_email: normalized,
  });

  if (error) {
    throw new Error('Não foi possível buscar o usuário.');
  }

  const row = Array.isArray(data) ? data[0] : null;
  if (!row) return null;

  return {
    id: row.id,
    full_name: row.full_name,
    email: row.email,
    avatar_url: row.avatar_url ?? null,
  };
}
