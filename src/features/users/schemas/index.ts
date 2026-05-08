import { z } from 'zod';

export const createUserSchema = z.object({
  fullName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['administrador', 'usuario'], {
    required_error: 'Selecione um perfil',
  }),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const editUserSchema = z.object({
  fullName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  role: z.enum(['administrador', 'usuario'], {
    required_error: 'Selecione um perfil',
  }),
  active: z.boolean(),
});

export type EditUserSchema = z.infer<typeof editUserSchema>;

export const profileSchema = z.object({
  fullName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
});

export type ProfileSchema = z.infer<typeof profileSchema>;

export const changePasswordSchema = z.object({
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirme sua senha'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
