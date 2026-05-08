import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Modal,
  Stack,
  TextInput,
  PasswordInput,
  Select,
  Button,
  Alert,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { createUserSchema, type CreateUserSchema } from '../schemas';
import { useCreateUser } from '../hooks';

interface CreateUserModalProps {
  opened: boolean;
  onClose: () => void;
}

export function CreateUserModal({ opened, onClose }: CreateUserModalProps) {
  const createUser = useCreateUser();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      role: 'usuario',
    },
  });

  const onSubmit = async (data: CreateUserSchema) => {
    await createUser.mutateAsync({
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      role: data.role,
    });
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    createUser.reset();
    onClose();
  };

  return (
    <Modal opened={opened} onClose={handleClose} title="Novo Usuário" size="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          {createUser.isError && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
              {createUser.error?.message ?? 'Erro ao criar usuário.'}
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

          <PasswordInput
            label="Senha"
            placeholder="Mínimo 6 caracteres"
            {...register('password')}
            error={errors.password?.message}
          />

          <Select
            label="Perfil"
            placeholder="Selecione o perfil"
            data={[
              { value: 'administrador', label: 'Administrador' },
              { value: 'usuario', label: 'Usuário' },
            ]}
            defaultValue="usuario"
            onChange={(val) => setValue('role', val as 'administrador' | 'usuario')}
            error={errors.role?.message}
          />

          <Button
            type="submit"
            loading={createUser.isPending}
            fullWidth
            style={{
              background: 'var(--gradient-brand)',
              border: 'none',
            }}
          >
            Criar Usuário
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
