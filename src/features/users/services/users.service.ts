import { supabase } from '@/lib/supabase';
import type { Tables } from '@/lib/supabase';

export type Profile = Tables<'profiles'>;

/**
 * Fetch all users (admin only - RLS enforces this)
 */
export async function fetchAllUsers(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('Não foi possível carregar os usuários.');
  }

  return data;
}

/**
 * Create a new user via Supabase Auth + profile
 * Note: This uses supabase.auth.admin is NOT available on client.
 * We use a Supabase Edge Function or signUp approach.
 * For now, we create via signUp and then update profile role.
 */
export async function createUser(params: {
  email: string;
  password: string;
  fullName: string;
  role: 'administrador' | 'usuario';
}): Promise<void> {
  // Create auth user via Edge Function (admin-create-user)
  const { error } = await supabase.functions.invoke('admin-create-user', {
    body: {
      email: params.email,
      password: params.password,
      full_name: params.fullName,
      role: params.role,
    },
  });

  if (error) {
    throw new Error('Não foi possível criar o usuário.');
  }
}

/**
 * Update user profile (admin only - RLS enforces this)
 */
export async function updateUser(
  userId: string,
  data: {
    full_name?: string;
    email?: string;
    role?: 'administrador' | 'usuario';
    active?: boolean;
  },
): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    throw new Error('Não foi possível atualizar o usuário.');
  }
}

/**
 * Update own profile
 */
export async function updateMyProfile(data: {
  full_name: string;
  email: string;
}): Promise<void> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Usuário não autenticado.');
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: data.full_name,
      email: data.email,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    throw new Error('Não foi possível atualizar o perfil.');
  }

  // If email changed, update auth email too
  if (data.email !== user.email) {
    const { error: emailError } = await supabase.auth.updateUser({
      email: data.email,
    });

    if (emailError) {
      throw new Error('Perfil atualizado, mas não foi possível alterar o email de login.');
    }
  }
}

/**
 * Change own password
 */
export async function changeMyPassword(newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw new Error('Não foi possível alterar a senha.');
  }
}
