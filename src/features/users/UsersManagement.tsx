import { useState } from 'react';
import {
  Stack,
  Title,
  Text,
  Group,
  Button,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconUsers } from '@tabler/icons-react';
import { useUsers } from './hooks';
import { CreateUserModal, EditUserModal, UsersTable } from './components';
import type { Profile } from './services';

export function UsersManagement() {
  const [createOpened, createHandlers] = useDisclosure(false);
  const [editUser, setEditUser] = useState<Profile | null>(null);
  const { data: users, isLoading, error } = useUsers();

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end" wrap="wrap" gap="sm">
        <div>
          <Group gap="xs" mb={4}>
            <IconUsers size={20} style={{ color: 'var(--text-secondary)' }} />
            <Title order={3} fw={700}>
              Gerenciamento de Usuários
            </Title>
          </Group>
          <Text size="sm" c="dimmed">
            Cadastre e gerencie os usuários do sistema.
          </Text>
        </div>
        <Button
          leftSection={<IconPlus size={16} />}
          size="sm"
          onClick={createHandlers.open}
        >
          Novo Usuário
        </Button>
      </Group>

      <UsersTable
        users={users}
        isLoading={isLoading}
        error={error}
        onEdit={setEditUser}
      />

      <CreateUserModal opened={createOpened} onClose={createHandlers.close} />
      <EditUserModal
        opened={!!editUser}
        onClose={() => setEditUser(null)}
        user={editUser}
      />
    </Stack>
  );
}
