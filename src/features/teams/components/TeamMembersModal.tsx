import { useEffect, useState } from 'react';
import type { KeyboardEvent } from 'react';
import {
  Modal,
  Stack,
  Group,
  Text,
  ActionIcon,
  TextInput,
  Button,
  Alert,
  Loader,
  Center,
  Avatar,
  Paper,
} from '@mantine/core';
import {
  IconTrash,
  IconAlertCircle,
  IconSearch,
  IconUserPlus,
  IconCheck,
} from '@tabler/icons-react';
import {
  useTeamWithMembers,
  useAddTeamMember,
  useRemoveTeamMember,
  useFindUserByEmail,
} from '../hooks';
import type { Team, UserSearchResult } from '../services';

interface TeamMembersModalProps {
  opened: boolean;
  onClose: () => void;
  team: Team | null;
}

export function TeamMembersModal({ opened, onClose, team }: TeamMembersModalProps) {
  const [email, setEmail] = useState('');
  const [foundUser, setFoundUser] = useState<UserSearchResult | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const { data: teamData, isLoading } = useTeamWithMembers(team?.id ?? null);
  const findUser = useFindUserByEmail();
  const addMember = useAddTeamMember();
  const removeMember = useRemoveTeamMember();

  useEffect(() => {
    if (!opened) {
      setEmail('');
      setFoundUser(null);
      setLookupError(null);
      findUser.reset();
      addMember.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, team?.id]);

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

      const alreadyMember = teamData?.members.some((m) => m.user_id === user.id);
      if (alreadyMember) {
        setLookupError('Este usuário já pertence à equipe.');
        return;
      }

      setFoundUser(user);
    } catch {
      setLookupError('Não foi possível buscar o usuário.');
    }
  };

  const handleAdd = async () => {
    if (!team || !foundUser) return;
    try {
      await addMember.mutateAsync({ teamId: team.id, userId: foundUser.id });
      setEmail('');
      setFoundUser(null);
      setLookupError(null);
    } catch {
      // error surfaced via Alert below
    }
  };

  const handleRemove = async (userId: string) => {
    if (!team) return;
    await removeMember.mutateAsync({ teamId: team.id, userId });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title={`Membros — ${team?.name ?? ''}`} size="md">
      <Stack gap="md">
        {addMember.isError && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
            {addMember.error?.message ?? 'Erro ao adicionar membro.'}
          </Alert>
        )}

        {/* Email search */}
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
                  onClick={handleAdd}
                  loading={addMember.isPending}
                >
                  Adicionar
                </Button>
              </Group>
            </Paper>
          )}
        </Stack>

        {/* Members list */}
        {isLoading ? (
          <Center py="md">
            <Loader size="sm" />
          </Center>
        ) : teamData?.members.length === 0 ? (
          <Text size="sm" c="dimmed" ta="center" py="md">
            Nenhum membro nesta equipe.
          </Text>
        ) : (
          <Stack gap="xs">
            {teamData?.members.map((member) => (
              <Paper
                key={member.id}
                p="sm"
                radius="md"
                style={{
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--surface-raised)',
                }}
              >
                <Group justify="space-between" wrap="nowrap">
                  <Group gap="sm" wrap="nowrap">
                    <Avatar
                      size="sm"
                      radius="xl"
                      color="violet"
                      src={member.profile.avatar_url ?? undefined}
                    >
                      {member.profile.full_name?.charAt(0)?.toUpperCase() ?? 'U'}
                    </Avatar>
                    <div style={{ minWidth: 0 }}>
                      <Text size="sm" fw={500} truncate>
                        {member.profile.full_name}
                      </Text>
                      <Text size="xs" c="dimmed" truncate>
                        {member.profile.email}
                      </Text>
                    </div>
                    {team?.created_by === member.user_id && (
                      <Group gap={4} wrap="nowrap">
                        <IconCheck size={12} style={{ color: 'var(--mantine-color-brand-5)' }} />
                        <Text size="xs" c="dimmed">
                          Proprietário
                        </Text>
                      </Group>
                    )}
                  </Group>
                  {team?.created_by !== member.user_id && (
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      size="sm"
                      aria-label="Remover membro"
                      onClick={() => handleRemove(member.user_id)}
                      loading={removeMember.isPending}
                    >
                      <IconTrash size={14} />
                    </ActionIcon>
                  )}
                </Group>
              </Paper>
            ))}
          </Stack>
        )}

        {teamData && (
          <Text size="xs" c="dimmed" ta="center">
            {teamData.members.length} membro(s) na equipe
          </Text>
        )}
      </Stack>
    </Modal>
  );
}
