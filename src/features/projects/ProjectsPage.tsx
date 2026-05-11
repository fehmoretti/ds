import { useState } from 'react';
import {
  AppShell,
  Container,
  Stack,
  Title,
  Text,
  Group,
  Button,
  SimpleGrid,
  Center,
  Loader,
  Alert,
  ActionIcon,
  Tooltip,
  Box,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconPlus,
  IconLogout,
  IconAlertCircle,
  IconFolderOff,
  IconUsers,
  IconUsersGroup,
  IconUser,
} from '@tabler/icons-react';
import Logo from '@/assets/logo.svg?react';
import { useAuth } from '@/providers';
import { useProjects, useDeleteProject } from './hooks';
import { CreateProjectModal, ProjectCard, ProjectMembersModal } from './components';
import { UsersManagement, MyProfile } from '@/features/users';
import { TeamsManagement } from '@/features/teams';
import type { Project } from '@/services/projects.service';

type AppView = 'projects' | 'token-editor' | 'users' | 'teams' | 'profile';

interface ProjectsPageProps {
  onOpenProject: (projectId: string) => void;
  activeView?: AppView;
  onNavigate?: (view: AppView) => void;
}

export function ProjectsPage({ onOpenProject, activeView = 'projects', onNavigate }: ProjectsPageProps) {
  const [createOpened, createHandlers] = useDisclosure(false);
  const [membersProject, setMembersProject] = useState<Project | null>(null);
  const { profile, isAdmin, signOut } = useAuth();
  const { data: projects, isLoading, error } = useProjects();
  const deleteProject = useDeleteProject();

  const handleDelete = async (projectId: string) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return;
    await deleteProject.mutateAsync(projectId);
  };

  return (
    <AppShell header={{ height: 64 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="lg" justify="space-between">
          <Group gap="sm" style={{ cursor: 'pointer' }} onClick={() => onNavigate?.('projects')}>
            <Logo style={{ width: 24, height: 27 }} />
            <Title order={4} fw={600}>
              Design System DT
            </Title>
          </Group>
          <Group gap="sm">
            {isAdmin && (
              <Tooltip label="Gerenciar Usuários" position="bottom">
                <ActionIcon
                  variant={activeView === 'users' ? 'light' : 'subtle'}
                  color={activeView === 'users' ? 'brand' : 'gray'}
                  onClick={() => onNavigate?.('users')}
                  size="lg"
                  aria-label="Gerenciar Usuários"
                >
                  <IconUsers size={18} />
                </ActionIcon>
              </Tooltip>
            )}
            {isAdmin && (
              <Tooltip label="Gerenciar Equipes" position="bottom">
                <ActionIcon
                  variant={activeView === 'teams' ? 'light' : 'subtle'}
                  color={activeView === 'teams' ? 'brand' : 'gray'}
                  onClick={() => onNavigate?.('teams')}
                  size="lg"
                  aria-label="Gerenciar Equipes"
                >
                  <IconUsersGroup size={18} />
                </ActionIcon>
              </Tooltip>
            )}
            <Tooltip label="Meu Perfil" position="bottom">
              <ActionIcon
                variant={activeView === 'profile' ? 'light' : 'subtle'}
                color={activeView === 'profile' ? 'brand' : 'gray'}
                onClick={() => onNavigate?.('profile')}
                size="lg"
                aria-label="Meu Perfil"
              >
                <IconUser size={18} />
              </ActionIcon>
            </Tooltip>
            {profile && (
              <Text size="sm" c="dimmed" fw={500}>
                {profile.full_name}
              </Text>
            )}
            <Tooltip label="Sair" position="bottom">
              <ActionIcon variant="subtle" color="gray" onClick={signOut} size="lg" aria-label="Sair">
                <IconLogout size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg" py="xl">
          {activeView === 'users' && isAdmin && <UsersManagement />}
          {activeView === 'teams' && isAdmin && <TeamsManagement />}
          {activeView === 'profile' && <MyProfile />}
          {activeView === 'projects' && (
          <Stack gap="xl" className="animate-fade-in">
            <Group justify="space-between" align="flex-end">
              <div>
                <Title order={2} fw={700} mb={4}>
                  Projetos
                </Title>
                <Text size="sm" c="dimmed">
                  Gerencie seus design systems e tokens
                </Text>
              </div>
              <Button
                leftSection={<IconPlus size={16} />}
                onClick={createHandlers.open}
              >
                Novo Projeto
              </Button>
            </Group>

            {isLoading && (
              <Center py={80}>
                <Stack align="center" gap="md">
                  <Loader size="md" />
                  <Text size="sm" c="dimmed">Carregando projetos...</Text>
                </Stack>
              </Center>
            )}

            {error && (
              <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" radius="lg">
                Falha ao carregar projetos. Tente novamente.
              </Alert>
            )}

            {!isLoading && !error && projects?.length === 0 && (
              <Center py={80}>
                <Stack align="center" gap="md">
                  <Box
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 16,
                      background: 'var(--surface-glass)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconFolderOff size={28} color="var(--text-tertiary)" />
                  </Box>
                  <Stack align="center" gap={4}>
                    <Text fw={500}>Nenhum projeto encontrado</Text>
                    <Text c="dimmed" size="sm">
                      Crie seu primeiro design system
                    </Text>
                  </Stack>
                  <Button
                    variant="light"
                    size="sm"
                    onClick={createHandlers.open}
                    leftSection={<IconPlus size={14} />}
                  >
                    Criar projeto
                  </Button>
                </Stack>
              </Center>
            )}

            {projects && projects.length > 0 && (
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg" className="animate-stagger">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onOpen={onOpenProject}
                    onDelete={handleDelete}
                    onManageMembers={setMembersProject}
                  />
                ))}
              </SimpleGrid>
            )}
          </Stack>
          )}
        </Container>
      </AppShell.Main>

      <CreateProjectModal opened={createOpened} onClose={createHandlers.close} />
      <ProjectMembersModal
        opened={!!membersProject}
        onClose={() => setMembersProject(null)}
        project={membersProject}
      />
    </AppShell>
  );
}
