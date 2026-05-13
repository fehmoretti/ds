import {
  Group,
  Title,
  Avatar,
  Button,
  AppShell,
  Burger,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { Logo } from '@/shared/components';

interface DashboardHeaderProps {
  onCreateProject: () => void;
}

export function DashboardHeader({ onCreateProject }: DashboardHeaderProps) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell.Header p="md">
      <Group justify="space-between" h="100%">
        <Group>
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="sm"
            size="sm"
            aria-label="Toggle navigation"
          />
          <Logo style={{ width: 24, height: 27 }} />
          <Title order={3} visibleFrom="sm">
            DS Tokens Setup
          </Title>
          <Text fw={600} hiddenFrom="sm">
            DS Tokens Setup
          </Text>
        </Group>

        <Group>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={onCreateProject}
            visibleFrom="xs"
          >
            Novo Projeto
          </Button>
          <Button
            size="compact-sm"
            leftSection={<IconPlus size={14} />}
            onClick={onCreateProject}
            hiddenFrom="xs"
          >
            Novo
          </Button>
          <Avatar radius="xl" color="blue" aria-label="Avatar do usuário">
            U
          </Avatar>
        </Group>
      </Group>
    </AppShell.Header>
  );
}
