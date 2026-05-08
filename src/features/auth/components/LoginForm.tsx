import { useState } from 'react';
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Stack,
  Anchor,
  Alert,
  Container,
  Center,
} from '@mantine/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconAlertCircle } from '@tabler/icons-react';
import Logo from '@/assets/logo.svg?react';
import { loginSchema, type LoginSchema } from '../schemas';
import { signInWithEmail } from '../services';

interface LoginFormProps {
  onToggleMode: () => void;
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    setError(null);
    setIsLoading(true);

    try {
      await signInWithEmail(data.email, data.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Center mih="100vh" style={{ background: 'var(--surface-base)' }}>
      <Container size={400} w="100%">
        <Stack align="center" mb="xl" className="animate-fade-in">
          <Logo style={{ width: 40, height: 45 }} />
          <Title order={2} fw={700} ta="center">
            Design System DT
          </Title>
          <Text c="dimmed" size="sm" ta="center">
            Faça login para acessar seus projetos
          </Text>
        </Stack>

        <Paper
          p="xl"
          radius="lg"
          className="surface-card animate-fade-in"
          style={{ animationDelay: '100ms' }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="md">
              {error && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  color="red"
                  variant="light"
                  radius="md"
                >
                  {error}
                </Alert>
              )}

              <TextInput
                label="Email"
                placeholder="seu@email.com"
                required
                error={errors.email?.message}
                {...register('email')}
              />

              <PasswordInput
                label="Senha"
                placeholder="Sua senha"
                required
                error={errors.password?.message}
                {...register('password')}
              />

              <Button
                type="submit"
                fullWidth
                loading={isLoading}
              >
                Entrar
              </Button>
            </Stack>
          </form>

          <Text c="dimmed" size="sm" ta="center" mt="lg">
            Não tem uma conta?{' '}
            <Anchor component="button" size="sm" onClick={onToggleMode} fw={500}>
              Criar conta
            </Anchor>
          </Text>
        </Paper>
      </Container>
    </Center>
  );
}
