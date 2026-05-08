import {
  Table,
  Badge,
  Progress,
  Text,
  Card,
  Skeleton,
  Stack,
  Alert,
  Group,
  ScrollArea,
} from '@mantine/core';
import { IconAlertCircle, IconDatabaseOff } from '@tabler/icons-react';
import { useProjects } from '../hooks';
import type { ProjectItem } from '../types';

const STATUS_CONFIG: Record<
  ProjectItem['status'],
  { label: string; color: string }
> = {
  active: { label: 'Ativo', color: 'green' },
  paused: { label: 'Pausado', color: 'yellow' },
  completed: { label: 'Concluído', color: 'blue' },
  archived: { label: 'Arquivado', color: 'gray' },
};

function ProjectTableSkeleton() {
  return (
    <Stack gap="sm">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} height={40} />
      ))}
    </Stack>
  );
}

function EmptyState() {
  return (
    <Stack align="center" py="xl" gap="sm">
      <IconDatabaseOff size={48} color="var(--mantine-color-gray-5)" />
      <Text c="dimmed" ta="center">
        Nenhum projeto encontrado.
      </Text>
      <Text size="sm" c="dimmed" ta="center">
        Crie seu primeiro projeto para começar.
      </Text>
    </Stack>
  );
}

export function ProjectsTable() {
  const { data: projects, isLoading, isError } = useProjects();

  if (isLoading) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text fw={600} mb="md">
          Projetos
        </Text>
        <ProjectTableSkeleton />
      </Card>
    );
  }

  if (isError) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Erro ao carregar projetos"
        color="red"
        variant="light"
      >
        Não foi possível carregar a lista de projetos. Tente novamente.
      </Alert>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text fw={600} mb="md">
          Projetos
        </Text>
        <EmptyState />
      </Card>
    );
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Text fw={600}>Projetos</Text>
        <Badge variant="light" color="blue">
          {projects.length} total
        </Badge>
      </Group>

      <ScrollArea>
        <Table striped highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nome</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Responsável</Table.Th>
              <Table.Th>Progresso</Table.Th>
              <Table.Th>Atualizado</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {projects.map((project) => {
              const statusConfig = STATUS_CONFIG[project.status];
              return (
                <Table.Tr key={project.id}>
                  <Table.Td>
                    <Text size="sm" fw={500}>
                      {project.name}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={statusConfig.color}
                      variant="light"
                      size="sm"
                    >
                      {statusConfig.label}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{project.owner}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Progress
                        value={project.progress}
                        size="sm"
                        style={{ flex: 1 }}
                        color={
                          project.progress === 100 ? 'green' : 'blue'
                        }
                      />
                      <Text size="xs" c="dimmed" w={35}>
                        {project.progress}%
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {project.updatedAt}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Card>
  );
}
