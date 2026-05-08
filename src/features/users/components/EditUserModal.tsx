import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Modal,
  Stack,
  TextInput,
  Select,
  Switch,
  Button,
  Alert,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { editUserSchema, type EditUserSchema } from '../schemas';
import { useUpdateUser } from '../hooks';
import type { Profile } from '../services';

interface EditUserModalProps {
  opened: boolean;
  onClose: () => void;
  user: Profile | null;
}

export function EditUserModal({ opened, onClose, user }: EditUserModalProps) {
  const updateUser = useUpdateUser();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EditUserSchema>({
    resolver: zodResolver(editUserSchema),
    values: user
      ? {
          fullName: user.full_name,
          email: user.email,
          role: user.role,
          active: user.active,
        }
      : undefined,
  });

  const activeValue = watch('active');

  const onSubmit = async (data: EditUserSchema) => {
    if (!user) return;

    await updateUser.mutateAsync({
      userId: user.id,
      data: {
        full_name: data.fullName,
        email: data.email,
        role: data.role,
        active: data.active,
      },
    });
    onClose();
  };

  const handleClose = () => {
    reset();
    updateUser.reset();
    onClose();
  };

  return (
    <Modal opened={opened} onClose={handleClose} title="Editar Usuário" size="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          {updateUser.isError && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
              {updateUser.error?.message ?? 'Erro ao atualizar usuário.'}
            </Alert>
          )}

          <TextInput
            label="Nome completo"
            placeholder="Nome do usuário"
            {...register('fullName')}
            error={errors.fullName?.message}
          />

          <TextInput
            label="Email"
            placeholder="email@exemplo.com"
            {...register('email')}
            error={errors.email?.message}
          />

          <Select
            label="Perfil"
            data={[
              { value: 'administrador', label: 'Administrador' },
              { value: 'usuario', label: 'Usuário' },
            ]}
            value={watch('role')}
            onChange={(val) => setValue('role', val as 'administrador' | 'usuario')}
            error={errors.role?.message}
          />

          <Switch
            label="Usuário ativo"
            checked={activeValue}
            onChange={(e) => setValue('active', e.currentTarget.checked)}
          />

          <Button
            type="submit"
            loading={updateUser.isPending}
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
