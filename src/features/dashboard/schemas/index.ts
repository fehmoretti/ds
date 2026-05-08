import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  description: z
    .string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
  category: z.string().min(1, 'Selecione uma categoria'),
  priority: z.string().min(1, 'Selecione uma prioridade'),
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
