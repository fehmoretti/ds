import { useState } from 'react';
import {
  Stack,
  Title,
  Text,
  Group,
  Button,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconUsersGroup } from '@tabler/icons-react';
import { useAuth } from '@/providers';
import { useTeams, useDeleteTeam } from './hooks';
import { CreateTeamModal, EditTeamModal, TeamMembersModal, TeamsTable } from './components';
import type { Team } from './services';

export function TeamsManagement() {
  const [createOpened, createHandlers] = useDisclosure(false);
  const [editTeam, setEditTeam] = useState<Team | null>(null);
  const [membersTeam, setMembersTeam] = useState<Team | null>(null);
  const { isAdmin } = useAuth();
  const { data: teams, isLoading, error } = useTeams();
  const deleteTeamMutation = useDeleteTeam();

  const handleDelete = async (team: Team) => {
    if (!confirm(`Tem certeza que deseja excluir a equipe "${team.name}"?`)) return;
    await deleteTeamMutation.mutateAsync(team.id);
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end" wrap="wrap" gap="sm">
        <div>
          <Group gap="xs" mb={4}>
            <IconUsersGroup size={20} style={{ color: 'var(--text-secondary)' }} />
            <Title order={3} fw={700}>
              {isAdmin ? 'Gerenciamento de Equipes' : 'Minhas Equipes'}
            </Title>
          </Group>
          <Text size="sm" c="dimmed">
            {isAdmin
              ? 'Visualize todas as equipes e gerencie seus membros.'
              : 'Crie suas equipes e adicione membros buscando pelo email.'}
          </Text>
        </div>
        <Button
          leftSection={<IconPlus size={16} />}
          size="sm"
          onClick={createHandlers.open}
        >
          Nova Equipe
        </Button>
      </Group>

      <TeamsTable
        teams={teams}
        isLoading={isLoading}
        error={error}
        onEdit={setEditTeam}
        onManageMembers={setMembersTeam}
        onDelete={handleDelete}
      />

      <CreateTeamModal opened={createOpened} onClose={createHandlers.close} />
      <EditTeamModal
        opened={!!editTeam}
        onClose={() => setEditTeam(null)}
        team={editTeam}
      />
      <TeamMembersModal
        opened={!!membersTeam}
        onClose={() => setMembersTeam(null)}
        team={membersTeam}
      />
    </Stack>
  );
}
