import {
  Modal,
  TextInput,
  Textarea,
  Button,
  Stack,
  MultiSelect,
  Text,
  Divider,
} from '@mantine/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useCreateProject } from '../hooks';
import { useTeamsForSelect, useUsersForSelect } from '@/features/teams/hooks';

const createProjectSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  description: z
    .string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional()
    .or(z.literal('')),
});

type CreateProjectForm = z.infer<typeof createProjectSchema>;

interface CreateProjectModalProps {
  opened: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ opened, onClose }: CreateProjectModalProps) {
  const createProject = useCreateProject();
  const { data: teamsOptions } = useTeamsForSelect();
  const { data: usersOptions } = useUsersForSelect();
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectForm>({
    resolver: zodResolver(createProjectSchema),
  });

  const onSubmit = async (data: CreateProjectForm) => {
    await createProject.mutateAsync({
      name: data.name,
      description: data.description || undefined,
      teamIds: selectedTeams,
      userIds: selectedUsers,
    });
    reset();
    setSelectedTeams([]);
    setSelectedUsers([]);
    onClose();
  };

  const handleClose = () => {
    reset();
    setSelectedTeams([]);
    setSelectedUsers([]);
    onClose();
  };

  return (
    <Modal opened={opened} onClose={handleClose} title="Novo Projeto" centered size="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Nome do projeto"
            placeholder="Ex: Design System App Mobile"
            required
            error={errors.name?.message}
            {...register('name')}
          />
          <Textarea
            label="Descrição"
            placeholder="Descrição opcional do projeto"
            rows={3}
            error={errors.description?.message}
            {...register('description')}
          />

          <Divider label="Acesso ao projeto" labelPosition="center" />

          <Text size="xs" c="dimmed">
            Selecione equipes e/ou usuários que terão acesso a este projeto.
          </Text>

          <MultiSelect
            label="Equipes"
            placeholder="Selecione equipes"
            data={teamsOptions ?? []}
            value={selectedTeams}
            onChange={setSelectedTeams}
            searchable
            clearable
          />

          <MultiSelect
            label="Usuários avulsos"
            placeholder="Selecione usuários"
            data={usersOptions ?? []}
            value={selectedUsers}
            onChange={setSelectedUsers}
            searchable
            clearable
          />

          <Button
            type="submit"
            fullWidth
            loading={createProject.isPending}
          >
            Criar Projeto
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
