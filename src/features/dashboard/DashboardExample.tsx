import { AppShell, Container, Stack, Title, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  DashboardHeader,
  MetricCards,
  ProjectsTable,
  CreateProjectModal,
  ConfirmModal,
} from './components';

export function DashboardExample() {
  const [createModalOpened, createModalHandlers] = useDisclosure(false);
  const [confirmModalOpened, confirmModalHandlers] = useDisclosure(false);

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <DashboardHeader onCreateProject={createModalHandlers.open} />

      <AppShell.Main>
        <Container size="xl" py="md">
          <Stack gap="xl">
            <div>
              <Title order={2} mb={4}>
                Dashboard
              </Title>
              <Text c="dimmed" size="sm">
                Visão geral dos seus projetos e métricas
              </Text>
            </div>

            <MetricCards />
            <ProjectsTable />
          </Stack>
        </Container>
      </AppShell.Main>

      <CreateProjectModal
        opened={createModalOpened}
        onClose={createModalHandlers.close}
      />

      <ConfirmModal
        opened={confirmModalOpened}
        onClose={confirmModalHandlers.close}
        onConfirm={() => {
          confirmModalHandlers.close();
        }}
        title="Confirmar Ação"
        message="Tem certeza que deseja realizar esta ação? Essa operação não pode ser desfeita."
        confirmLabel="Sim, confirmar"
      />
    </AppShell>
  );
}
