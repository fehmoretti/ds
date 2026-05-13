import {
  Table,
  ActionIcon,
  Tooltip,
  Group,
  Text,
  Loader,
  Center,
  Alert,
  Paper,
} from '@mantine/core';
import { IconEdit, IconUsers, IconTrash, IconAlertCircle } from '@tabler/icons-react';
import { useAuth } from '@/providers';
import type { Team } from '../services';

interface TeamsTableProps {
  teams: Team[] | undefined;
  isLoading: boolean;
  error: Error | null;
  onEdit: (team: Team) => void;
  onManageMembers: (team: Team) => void;
  onDelete: (team: Team) => void;
}

export function TeamsTable({ teams, isLoading, error, onEdit, onManageMembers, onDelete }: TeamsTableProps) {
  const { user, isAdmin } = useAuth();
  const currentUserId = user?.id;
  if (isLoading) {
    return (
      <Center py="xl">
        <Loader size="md" />
      </Center>
    );
  }

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
        Erro ao carregar equipes. Tente novamente mais tarde.
      </Alert>
    );
  }

  if (!teams?.length) {
    return (
      <Center py="xl">
        <Text c="dimmed">Nenhuma equipe encontrada.</Text>
      </Center>
    );
  }

  return (
    <Paper className="surface-card" radius="lg" style={{ overflow: 'hidden' }}>
      <Table.ScrollContainer minWidth={600}>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nome</Table.Th>
            <Table.Th>Descrição</Table.Th>
            <Table.Th>Criada em</Table.Th>
            <Table.Th ta="right">Ações</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {teams.map((team) => {
            const canManage = isAdmin || team.created_by === currentUserId;
            return (
            <Table.Tr key={team.id}>
              <Table.Td>
                <Text size="sm" fw={500}>
                  {team.name}
                </Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm" c="dimmed" lineClamp={1}>
                  {team.description || '—'}
                </Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm" c="dimmed">
                  {new Date(team.created_at).toLocaleDateString('pt-BR')}
                </Text>
              </Table.Td>
              <Table.Td>
                <Group gap="xs" justify="flex-end">
                  <Tooltip label={canManage ? 'Gerenciar membros' : 'Ver membros'}>
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      aria-label="Gerenciar membros"
                      onClick={() => onManageMembers(team)}
                    >
                      <IconUsers size={16} />
                    </ActionIcon>
                  </Tooltip>
                  {canManage && (
                    <Tooltip label="Editar equipe">
                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        aria-label="Editar equipe"
                        onClick={() => onEdit(team)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                  {canManage && (
                    <Tooltip label="Excluir equipe">
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        aria-label="Excluir equipe"
                        onClick={() => onDelete(team)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </Group>
              </Table.Td>
            </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
      </Table.ScrollContainer>
    </Paper>
  );
}
