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
import { createTeamSchema, type CreateTeamSchema } from '../schemas';
import { useCreateTeam } from '../hooks';

interface CreateTeamModalProps {
  opened: boolean;
  onClose: () => void;
}

export function CreateTeamModal({ opened, onClose }: CreateTeamModalProps) {
  const createTeam = useCreateTeam();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTeamSchema>({
    resolver: zodResolver(createTeamSchema),
  });

  const onSubmit = async (data: CreateTeamSchema) => {
    await createTeam.mutateAsync({
      name: data.name,
      description: data.description || undefined,
    });
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    createTeam.reset();
    onClose();
  };

  return (
    <Modal opened={opened} onClose={handleClose} title="Nova Equipe" size="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          {createTeam.isError && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
              {createTeam.error?.message ?? 'Erro ao criar equipe.'}
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
            loading={createTeam.isPending}
            fullWidth
            style={{
              background: 'var(--gradient-brand)',
              border: 'none',
            }}
          >
            Criar Equipe
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
