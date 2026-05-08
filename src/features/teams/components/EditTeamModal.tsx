import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Modal,
  Stack,
  TextInput,
  Textarea,
  Button,
  Alert,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { editTeamSchema, type EditTeamSchema } from '../schemas';
import { useUpdateTeam } from '../hooks';
import type { Team } from '../services';

interface EditTeamModalProps {
  opened: boolean;
  onClose: () => void;
  team: Team | null;
}

export function EditTeamModal({ opened, onClose, team }: EditTeamModalProps) {
  const updateTeam = useUpdateTeam();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditTeamSchema>({
    resolver: zodResolver(editTeamSchema),
    values: team
      ? {
          name: team.name,
          description: team.description ?? '',
        }
      : undefined,
  });

  const onSubmit = async (data: EditTeamSchema) => {
    if (!team) return;

    await updateTeam.mutateAsync({
      teamId: team.id,
      data: {
        name: data.name,
        description: data.description || null,
      },
    });
    onClose();
  };

  const handleClose = () => {
    reset();
    updateTeam.reset();
    onClose();
  };

  return (
    <Modal opened={opened} onClose={handleClose} title="Editar Equipe" size="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          {updateTeam.isError && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
              {updateTeam.error?.message ?? 'Erro ao atualizar equipe.'}
            </Alert>
          )}

          <TextInput
            label="Nome da equipe"
            placeholder="Ex: Frontend, Design, Backend"
            {...register('name')}
            error={errors.name?.message}
          />

          <Textarea
            label="Descrição"
            placeholder="Descrição opcional da equipe"
            rows={3}
            {...register('description')}
            error={errors.description?.message}
          />

          <Button
            type="submit"
            loading={updateTeam.isPending}
            fullWidth
            style={{
              background: 'var(--gradient-brand)',
              border: 'none',
            }}
          >
            Salvar Alterações
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
