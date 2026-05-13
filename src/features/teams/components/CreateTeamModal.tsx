import { useEffect, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Modal,
  Stack,
  TextInput,
  Textarea,
  Button,
  Alert,
  Group,
  Text,
  Paper,
  ActionIcon,
  Avatar,
  Divider,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconSearch,
  IconUserPlus,
  IconX,
} from '@tabler/icons-react';
import { createTeamSchema, type CreateTeamSchema } from '../schemas';
import {
  useCreateTeam,
  useAddTeamMember,
  useFindUserByEmail,
} from '../hooks';
import type { UserSearchResult } from '../services';

interface CreateTeamModalProps {
  opened: boolean;
  onClose: () => void;
}

export function CreateTeamModal({ opened, onClose }: CreateTeamModalProps) {
  const [email, setEmail] = useState('');
  const [foundUser, setFoundUser] = useState<UserSearchResult | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [pendingMembers, setPendingMembers] = useState<UserSearchResult[]>([]);
  const [memberError, setMemberError] = useState<string | null>(null);

  const createTeam = useCreateTeam();
  const addMember = useAddTeamMember();
  const findUser = useFindUserByEmail();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTeamSchema>({
    resolver: zodResolver(createTeamSchema),
  });

  useEffect(() => {
    if (!opened) {
      reset();
      setEmail('');
      setFoundUser(null);
      setLookupError(null);
      setPendingMembers([]);
      setMemberError(null);
      createTeam.reset();
      addMember.reset();
      findUser.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  const handleSearch = async () => {
    setLookupError(null);
    setFoundUser(null);

    const normalized = email.trim();
    if (!normalized) {
      setLookupError('Informe um email para buscar.');
      return;
    }

    try {
      const user = await findUser.mutateAsync(normalized);
      if (!user) {
        setLookupError('Nenhum usuário ativo encontrado com este email.');
        return;
      }

      if (pendingMembers.some((m) => m.id === user.id)) {
        setLookupError('Este usuário já está na lista.');
        return;
      }

      setFoundUser(user);
    } catch {
      setLookupError('Não foi possível buscar o usuário.');
    }
  };

  const handleAddPending = () => {
    if (!foundUser) return;
    setPendingMembers((prev) => [...prev, foundUser]);
    setFoundUser(null);
    setEmail('');
    setLookupError(null);
  };

  const handleRemovePending = (userId: string) => {
    setPendingMembers((prev) => prev.filter((m) => m.id !== userId));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const onSubmit = async (data: CreateTeamSchema) => {
    setMemberError(null);
    try {
      const team = await createTeam.mutateAsync({
        name: data.name,
        description: data.description || undefined,
      });

      // Add each pending member; collect failures but don't abort.
      const failures: string[] = [];
      for (const member of pendingMembers) {
        try {
          await addMember.mutateAsync({ teamId: team.id, userId: member.id });
        } catch {
          failures.push(member.email);
        }
      }

      if (failures.length > 0) {
        setMemberError(
          `Equipe criada, mas não foi possível adicionar: ${failures.join(', ')}.`,
        );
        return;
      }

      onClose();
    } catch {
      // surfaced via createTeam.isError below
    }
  };

  const isSubmitting = createTeam.isPending || addMember.isPending;

  return (
    <Modal opened={opened} onClose={onClose} title="Nova Equipe" size="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          {createTeam.isError && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
              {createTeam.error?.message ?? 'Erro ao criar equipe.'}
            </Alert>
          )}
          {memberError && (
            <Alert icon={<IconAlertCircle size={16} />} color="yellow" variant="light">
              {memberError}
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

          <Divider
            label="Membros (opcional)"
            labelPosition="left"
          />

          <Stack gap="xs">
            <Group gap="sm" align="flex-end">
              <TextInput
                label="Adicionar membro por email"
                placeholder="usuario@exemplo.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.currentTarget.value);
                  if (lookupError) setLookupError(null);
                  if (foundUser) setFoundUser(null);
                }}
                onKeyDown={handleKeyDown}
                type="email"
                autoComplete="off"
                style={{ flex: 1 }}
                error={lookupError ?? undefined}
              />
              <Button
                leftSection={<IconSearch size={14} />}
                size="sm"
                variant="default"
                onClick={handleSearch}
                loading={findUser.isPending}
                disabled={!email.trim()}
              >
                Buscar
              </Button>
            </Group>

            {foundUser && (
              <Paper
                p="sm"
                radius="md"
                style={{
                  border: '1px solid var(--mantine-color-brand-5, #a855f7)',
                  background: 'var(--surface-raised)',
                }}
              >
                <Group justify="space-between" wrap="nowrap">
                  <Group gap="sm" wrap="nowrap">
                    <Avatar size="sm" radius="xl" color="violet" src={foundUser.avatar_url ?? undefined}>
                      {foundUser.full_name?.charAt(0)?.toUpperCase() ?? 'U'}
                    </Avatar>
                    <div style={{ minWidth: 0 }}>
                      <Text size="sm" fw={500} truncate>
                        {foundUser.full_name}
                      </Text>
                      <Text size="xs" c="dimmed" truncate>
                        {foundUser.email}
                      </Text>
                    </div>
                  </Group>
                  <Button
                    leftSection={<IconUserPlus size={14} />}
                    size="xs"
                    onClick={handleAddPending}
                  >
                    Incluir
                  </Button>
                </Group>
              </Paper>
            )}

            {pendingMembers.length > 0 && (
              <Stack gap={6}>
                {pendingMembers.map((m) => (
                  <Paper
                    key={m.id}
                    p="xs"
                    radius="md"
                    style={{
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--surface-raised)',
                    }}
                  >
                    <Group justify="space-between" wrap="nowrap">
                      <Group gap="sm" wrap="nowrap">
                        <Avatar size="xs" radius="xl" color="violet" src={m.avatar_url ?? undefined}>
                          {m.full_name?.charAt(0)?.toUpperCase() ?? 'U'}
                        </Avatar>
                        <div style={{ minWidth: 0 }}>
                          <Text size="xs" fw={500} truncate>
                            {m.full_name}
                          </Text>
                          <Text size="xs" c="dimmed" truncate>
                            {m.email}
                          </Text>
                        </div>
                      </Group>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        size="sm"
                        aria-label="Remover da lista"
                        onClick={() => handleRemovePending(m.id)}
                      >
                        <IconX size={14} />
                      </ActionIcon>
                    </Group>
                  </Paper>
                ))}
                <Text size="xs" c="dimmed">
                  {pendingMembers.length} membro(s) serão adicionados ao criar a equipe.
                </Text>
              </Stack>
            )}
          </Stack>

          <Button type="submit" loading={isSubmitting} fullWidth mt="sm">
            Criar Equipe
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
