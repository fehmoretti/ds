import { supabase, type Tables, type TablesInsert, type TablesUpdate } from '@/lib/supabase';
import type { Json } from '@/lib/supabase/database.types';

type Project = Tables<'projects'>;
type ProjectInsert = TablesInsert<'projects'>;
type ProjectUpdate = TablesUpdate<'projects'>;
type ProjectMember = Tables<'project_members'>;

export type { Project, ProjectInsert, ProjectUpdate, ProjectMember };

/**
 * Fetch projects for the current user.
 * - Admins see all projects (handled by RLS).
 * - Regular users see only their own projects + projects they're members of.
 */
export async function fetchUserProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error('Falha ao carregar projetos');
  }

  return data;
}

/**
 * Fetch a single project by ID.
 */
export async function fetchProject(projectId: string): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (error) {
    throw new Error('Falha ao carregar projeto');
  }

  return data;
}

/**
 * Create a new project.
 */
export async function createProject(project: Omit<ProjectInsert, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single();

  if (error) {
    throw new Error('Falha ao criar projeto');
  }

  return data;
}

/**
 * Update a project (including tokens_data).
 */
export async function updateProject(projectId: string, updates: ProjectUpdate): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', projectId)
    .select()
    .single();

  if (error) {
    throw new Error('Falha ao atualizar projeto');
  }

  return data;
}

/**
 * Delete a project.
 */
export async function deleteProject(projectId: string): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);

  if (error) {
    throw new Error('Falha ao excluir projeto');
  }
}

/**
 * Fetch members of a project.
 */
export async function fetchProjectMembers(projectId: string): Promise<(ProjectMember & { profile?: Tables<'profiles'> })[]> {
  const { data, error } = await supabase
    .from('project_members')
    .select('*, profile:profiles(*)')
    .eq('project_id', projectId);

  if (error) {
    throw new Error('Falha ao carregar membros do projeto');
  }

  return data as (ProjectMember & { profile?: Tables<'profiles'> })[];
}

/**
 * Add a member to a project by their email.
 * The user must exist in profiles.
 */
export async function addProjectMember(
  projectId: string,
  email: string,
  role: string = 'editor',
): Promise<ProjectMember> {
  // Find user by email
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (profileError || !profile) {
    throw new Error('Usuário não encontrado. Verifique o email informado.');
  }

  const { data, error } = await supabase
    .from('project_members')
    .insert({
      project_id: projectId,
      user_id: profile.id,
      role,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('Este usuário já é membro do projeto.');
    }
    throw new Error('Falha ao adicionar membro ao projeto');
  }

  return data;
}

/**
 * Remove a member from a project.
 */
export async function removeProjectMember(
  projectId: string,
  userId: string,
): Promise<void> {
  const { error } = await supabase
    .from('project_members')
    .delete()
    .eq('project_id', projectId)
    .eq('user_id', userId);

  if (error) {
    throw new Error('Falha ao remover membro do projeto');
  }
}

/**
 * Add a member to a project by user ID.
 */
export async function addProjectMemberById(
  projectId: string,
  userId: string,
  role: string = 'editor',
): Promise<void> {
  const { error } = await supabase
    .from('project_members')
    .insert({ project_id: projectId, user_id: userId, role });

  if (error) {
    if (error.code === '23505') return; // Already a member, skip
    throw new Error('Falha ao adicionar membro ao projeto');
  }
}

/**
 * Sync project members from selected teams and individual users.
 * Adds new members and removes those no longer selected.
 */
export async function syncProjectMembers(
  projectId: string,
  ownerId: string,
  teamIds: string[],
  userIds: string[],
): Promise<void> {
  // Resolve all user IDs from teams
  const allUserIds = new Set<string>(userIds);

  if (teamIds.length > 0) {
    const { data: teamMembers } = await supabase
      .from('team_members')
      .select('user_id')
      .in('team_id', teamIds);

    if (teamMembers) {
      teamMembers.forEach((tm) => allUserIds.add(tm.user_id));
    }
  }

  // Remove owner from the set
  allUserIds.delete(ownerId);

  // Fetch current members
  const { data: currentMembers } = await supabase
    .from('project_members')
    .select('user_id')
    .eq('project_id', projectId);

  const currentUserIds = new Set(currentMembers?.map((m) => m.user_id) ?? []);

  // Users to add
  const toAdd = Array.from(allUserIds).filter((id) => !currentUserIds.has(id));
  // Users to remove
  const toRemove = Array.from(currentUserIds).filter((id) => !allUserIds.has(id));

  // Add new members
  if (toAdd.length > 0) {
    const inserts = toAdd.map((userId) => ({
      project_id: projectId,
      user_id: userId,
      role: 'editor',
    }));
    await supabase.from('project_members').insert(inserts);
  }

  // Remove old members
  if (toRemove.length > 0) {
    await supabase
      .from('project_members')
      .delete()
      .eq('project_id', projectId)
      .in('user_id', toRemove);
  }
}

/**
 * Save design tokens to a project.
 */
export async function saveProjectTokens(
  projectId: string,
  tokensData: Record<string, unknown>,
): Promise<Project> {
  return updateProject(projectId, { tokens_data: tokensData as unknown as Json });
}

/**
 * Upload a project logo and update the project's logo_url.
 */
export async function uploadProjectLogo(
  projectId: string,
  file: File,
): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'png';
  const path = `${projectId}/logo.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('project-logos')
    .upload(path, file, { upsert: true });

  if (uploadError) {
    throw new Error('Falha ao enviar logo do projeto');
  }

  const { data: urlData } = supabase.storage
    .from('project-logos')
    .getPublicUrl(path);

  const logoUrl = urlData.publicUrl;

  await updateProject(projectId, { logo_url: logoUrl });

  return logoUrl;
}
