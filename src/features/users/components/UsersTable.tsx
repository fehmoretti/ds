import {
  Table,
  Badge,
  ActionIcon,
  Tooltip,
  Group,
  Text,
  Loader,
  Center,
  Alert,
  Paper,
} from '@mantine/core';
import { IconEdit, IconAlertCircle } from '@tabler/icons-react';
import type { Profile } from '../services';

interface UsersTableProps {
  users: Profile[] | undefined;
  isLoading: boolean;
  error: Error | null;
  onEdit: (user: Profile) => void;
}

export function UsersTable({ users, isLoading, error, onEdit }: UsersTableProps) {
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
        Erro ao carregar usuários. Tente novamente mais tarde.
      </Alert>
    );
  }

  if (!users?.length) {
    return (
      <Center py="xl">
        <Text c="dimmed">Nenhum usuário encontrado.</Text>
      </Center>
    );
  }

  return (
    <Paper className="surface-card" radius="lg" style={{ overflow: 'hidden' }}>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nome</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Perfil</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Criado em</Table.Th>
            <Table.Th ta="right">Ações</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {users.map((user) => (
            <Table.Tr key={user.id}>
              <Table.Td>
                <Text size="sm" fw={500}>
                  {user.full_name}
                </Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm" c="dimmed">
                  {user.email}
                </Text>
              </Table.Td>
              <Table.Td>
                <Badge
                  variant="light"
                  color={user.role === 'administrador' ? 'violet' : 'blue'}
                  size="sm"
                >
                  {user.role === 'administrador' ? 'Admin' : 'Usuário'}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Badge
                  variant="dot"
                  color={user.active ? 'green' : 'red'}
                  size="sm"
                >
                  {user.active ? 'Ativo' : 'Inativo'}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Text size="sm" c="dimmed">
                  {new Date(user.created_at).toLocaleDateString('pt-BR')}
                </Text>
              </Table.Td>
              <Table.Td>
                <Group gap="xs" justify="flex-end">
                  <Tooltip label="Editar usuário">
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      aria-label="Editar usuário"
                      onClick={() => onEdit(user)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
