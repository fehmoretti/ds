import { useState } from 'react';
import {
  Modal,
  Stack,
  Group,
  Text,
  ActionIcon,
  Select,
  Button,
  Alert,
  Loader,
  Center,
  Avatar,
  Paper,
} from '@mantine/core';
import { IconTrash, IconAlertCircle, IconPlus } from '@tabler/icons-react';
import { useTeamWithMembers, useAddTeamMember, useRemoveTeamMember, useUsersForSelect } from '../hooks';
import type { Team } from '../services';

interface TeamMembersModalProps {
  opened: boolean;
  onClose: () => void;
  team: Team | null;
}

export function TeamMembersModal({ opened, onClose, team }: TeamMembersModalProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { data: teamData, isLoading } = useTeamWithMembers(team?.id ?? null);
  const { data: usersOptions } = useUsersForSelect();
  const addMember = useAddTeamMember();
  const removeMember = useRemoveTeamMember();

  const handleAdd = async () => {
    if (!team || !selectedUserId) return;
    await addMember.mutateAsync({ teamId: team.id, userId: selectedUserId });
    setSelectedUserId(null);
  };

  const handleRemove = async (userId: string) => {
    if (!team) return;
    await removeMember.mutateAsync({ teamId: team.id, userId });
  };

  // Filter out users already in team
  const availableUsers = usersOptions?.filter(
    (u) => !teamData?.members.some((m) => m.user_id === u.value),
  );

  return (
    <Modal opened={opened} onClose={onClose} title={`Membros — ${team?.name ?? ''}`} size="md">
      <Stack gap="md">
        {addMember.isError && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
            {addMember.error?.message ?? 'Erro ao adicionar membro.'}
          </Alert>
        )}

        {/* Add member form */}
        <Group gap="sm">
          <Select
            placeholder="Selecione um usuário"
            data={availableUsers ?? []}
            value={selectedUserId}
            onChange={setSelectedUserId}
            searchable
            style={{ flex: 1 }}
          />
          <Button
            leftSection={<IconPlus size={14} />}
            size="sm"
            onClick={handleAdd}
            loading={addMember.isPending}
            disabled={!selectedUserId}
          >
            Adicionar
          </Button>
        </Group>

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
                <Group justify="space-between">
                  <Group gap="sm">
                    <Avatar size="sm" radius="xl" color="violet">
                      {member.profile.full_name?.charAt(0)?.toUpperCase() ?? 'U'}
                    </Avatar>
                    <div>
                      <Text size="sm" fw={500}>
                        {member.profile.full_name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {member.profile.email}
                      </Text>
                    </div>
                  </Group>
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
