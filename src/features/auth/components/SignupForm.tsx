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
  Box,
} from '@mantine/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { Logo } from '@/shared/components';
import { signupSchema, type SignupSchema } from '../schemas';
import { signUpWithEmail } from '../services';

interface SignupFormProps {
  onToggleMode: () => void;
}

export function SignupForm({ onToggleMode }: SignupFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupSchema) => {
    setError(null);
    setIsLoading(true);

    try {
      await signUpWithEmail(data.email, data.password, data.fullName);
      setSuccess(true);
    } catch (_err) {
      setError('Não foi possível criar a conta. Verifique os dados e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Center mih="100vh" style={{ background: 'var(--surface-base)' }}>
        <Container size={400} w="100%">
          <Paper p="xl" radius="lg" className="surface-card animate-fade-in">
            <Stack align="center" gap="md">
              <Box
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #40c057, #2f9e44)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconCheck size={24} color="white" />
              </Box>
              <Title order={3} ta="center" fw={600}>
                Conta criada!
              </Title>
              <Text size="sm" c="dimmed" ta="center">
                Verifique seu email para confirmar o cadastro.
              </Text>
              <Button variant="light" onClick={onToggleMode}>
                Voltar para login
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Center>
    );
  }

  return (
    <Center mih="100vh" style={{ background: 'var(--surface-base)' }}>
      <Container size={400} w="100%">
        <Stack align="center" mb="xl" className="animate-fade-in">
          <Logo style={{ width: 40, height: 45 }} />
          <Title order={2} fw={700} ta="center">
            Criar Conta
          </Title>
          <Text c="dimmed" size="sm" ta="center">
            Preencha os dados para começar
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
                >
                  {error}
                </Alert>
              )}

              <TextInput
                label="Nome completo"
                placeholder="Seu nome"
                required
                error={errors.fullName?.message}
                {...register('fullName')}
              />

              <TextInput
                label="Email"
                placeholder="seu@email.com"
                required
                error={errors.email?.message}
                {...register('email')}
              />

              <PasswordInput
                label="Senha"
                placeholder="Mínimo 6 caracteres"
                required
                error={errors.password?.message}
                {...register('password')}
              />

              <PasswordInput
                label="Confirmar senha"
                placeholder="Repita a senha"
                required
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <Button
                type="submit"
                fullWidth
                loading={isLoading}
              >
                Criar conta
              </Button>
            </Stack>
          </form>

          <Text c="dimmed" size="sm" ta="center" mt="lg">
            Já tem uma conta?{' '}
            <Anchor component="button" size="sm" onClick={onToggleMode} fw={500}>
              Fazer login
            </Anchor>
          </Text>
        </Paper>
      </Container>
    </Center>
  );
}
