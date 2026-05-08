import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Stack,
  Title,
  Text,
  Group,
  TextInput,
  PasswordInput,
  Button,
  Alert,
  Paper,
  Divider,
  Avatar,
} from '@mantine/core';
import {
  IconUser,
  IconCheck,
  IconAlertCircle,
} from '@tabler/icons-react';
import { useAuth } from '@/providers';
import { profileSchema, changePasswordSchema, type ProfileSchema, type ChangePasswordSchema } from './schemas';
import { useUpdateMyProfile, useChangeMyPassword } from './hooks';

export function MyProfile() {
  const { profile, refreshProfile } = useAuth();
  const updateProfile = useUpdateMyProfile();
  const changePassword = useChangeMyPassword();

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    values: profile
      ? {
          fullName: profile.full_name,
          email: profile.email,
        }
      : undefined,
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onProfileSubmit = async (data: ProfileSchema) => {
    await updateProfile.mutateAsync({
      full_name: data.fullName,
      email: data.email,
    });
    await refreshProfile();
  };

  const onPasswordSubmit = async (data: ChangePasswordSchema) => {
    await changePassword.mutateAsync(data.password);
    resetPasswordForm();
  };

  return (
    <Stack gap="lg">
      <div>
        <Group gap="xs" mb={4}>
          <IconUser size={20} style={{ color: 'var(--text-secondary)' }} />
          <Title order={3} fw={700}>
            Meu Perfil
          </Title>
        </Group>
        <Text size="sm" c="dimmed">
          Atualize suas informações pessoais e senha.
        </Text>
      </div>

      {/* Profile Info */}
      <Paper className="surface-card" radius="lg" p="lg">
        <Group gap="md" mb="lg">
          <Avatar size="lg" radius="xl" color="violet">
            {profile?.full_name?.charAt(0)?.toUpperCase() ?? 'U'}
          </Avatar>
          <div>
            <Text fw={600}>{profile?.full_name}</Text>
            <Text size="sm" c="dimmed">{profile?.email}</Text>
          </div>
        </Group>

        <Divider mb="lg" />

        <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
          <Stack gap="md">
            {updateProfile.isSuccess && (
              <Alert icon={<IconCheck size={16} />} color="green" variant="light">
                Perfil atualizado com sucesso!
              </Alert>
            )}
            {updateProfile.isError && (
              <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
                {updateProfile.error?.message ?? 'Erro ao atualizar perfil.'}
              </Alert>
            )}

            <TextInput
              label="Nome completo"
              placeholder="Seu nome"
              {...registerProfile('fullName')}
              error={profileErrors.fullName?.message}
            />

            <TextInput
              label="Email"
              placeholder="seu@email.com"
              {...registerProfile('email')}
              error={profileErrors.email?.message}
            />

            <Group justify="flex-end">
              <Button
                type="submit"
                loading={updateProfile.isPending}
              >
                Salvar Perfil
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>

      {/* Change Password */}
      <Paper className="surface-card" radius="lg" p="lg">
        <Title order={5} mb="md" fw={600}>
          Alterar Senha
        </Title>

        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
          <Stack gap="md">
            {changePassword.isSuccess && (
              <Alert icon={<IconCheck size={16} />} color="green" variant="light">
                Senha alterada com sucesso!
              </Alert>
            )}
            {changePassword.isError && (
              <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
                {changePassword.error?.message ?? 'Erro ao alterar senha.'}
              </Alert>
            )}

            <PasswordInput
              label="Nova senha"
              placeholder="Mínimo 6 caracteres"
              {...registerPassword('password')}
              error={passwordErrors.password?.message}
            />

            <PasswordInput
              label="Confirmar nova senha"
              placeholder="Repita a nova senha"
              {...registerPassword('confirmPassword')}
              error={passwordErrors.confirmPassword?.message}
            />

            <Group justify="flex-end">
              <Button
                type="submit"
                variant="light"
                loading={changePassword.isPending}
              >
                Alterar Senha
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}
