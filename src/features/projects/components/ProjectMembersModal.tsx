import { useState, useEffect } from 'react';
import {
  Modal,
  Stack,
  MultiSelect,
  Button,
  Text,
  Divider,
  Alert,
  Loader,
  Center,
  Group,
  Avatar,
  Paper,
} from '@mantine/core';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTeamsForSelect, useUsersForSelect } from '@/features/teams/hooks';
import {
  fetchProjectMembers,
  syncProjectMembers,
  type Project,
} from '@/services/projects.service';
import { useAuth } from '@/providers';

interface ProjectMembersModalProps {
  opened: boolean;
  onClose: () => void;
  project: Project | null;
}

export function ProjectMembersModal({ opened, onClose, project }: ProjectMembersModalProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: teamsOptions } = useTeamsForSelect();
  const { data: usersOptions } = useUsersForSelect();

  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  // Fetch current project members
  const { data: members, isLoading: loadingMembers } = useQuery({
    queryKey: ['project-members', project?.id],
    queryFn: () => fetchProjectMembers(project!.id),
    enabled: !!project && opened,
  });

  // Fetch teams currently associated (by checking which teams have all members in the project)
  // For simplicity, we initialize selectedUsers with existing member IDs
  useEffect(() => {
    if (members && project) {
      const memberUserIds = members
        .map((m) => m.user_id)
        .filter((id) => id !== project.owner_id);
      setSelectedUsers(memberUserIds);
    }
  }, [members, project]);

  // Reset teams on open (we don't persist team selection, only the resolved users)
  useEffect(() => {
    if (opened) {
      setSelectedTeams([]);
      setSuccess(false);
    }
  }, [opened]);

  const syncMutation = useMutation({
    mutationFn: async () => {
      if (!project || !user) return;
      await syncProjectMembers(
        project.id,
        project.owner_id,
        selectedTeams,
        selectedUsers,
      );
    },
    onSuccess: () => {
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['project-members', project?.id] });
      setTimeout(() => setSuccess(false), 3000);
    },
  });

  const handleSave = () => {
    syncMutation.mutate();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Acesso — ${project?.name ?? ''}`}
      size="lg"
    >
      <Stack gap="md">
        {syncMutation.isError && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
            Erro ao atualizar membros do projeto.
          </Alert>
        )}
        {success && (
          <Alert icon={<IconCheck size={16} />} color="green" variant="light">
            Membros atualizados com sucesso!
          </Alert>
        )}

        <Text size="sm" c="dimmed">
          Adicione equipes inteiras ou usuários individuais ao projeto.
          Membros de equipes selecionadas serão automaticamente incluídos.
        </Text>

        <MultiSelect
          label="Equipes"
          placeholder="Selecione equipes para adicionar seus membros"
          data={teamsOptions ?? []}
          value={selectedTeams}
          onChange={setSelectedTeams}
          searchable
          clearable
        />

        <MultiSelect
          label="Usuários avulsos"
          placeholder="Selecione usuários individuais"
          data={usersOptions?.filter((u) => u.value !== project?.owner_id) ?? []}
          value={selectedUsers}
          onChange={setSelectedUsers}
          searchable
          clearable
        />

        <Divider label="Membros atuais" labelPosition="center" />

        {loadingMembers ? (
          <Center py="md">
            <Loader size="sm" />
          </Center>
        ) : members && members.length > 0 ? (
          <Stack gap="xs" mah={250} style={{ overflowY: 'auto' }}>
            {members.map((member) => (
              <Paper
                key={member.id}
                p="xs"
                radius="md"
                style={{
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--surface-raised)',
                }}
              >
                <Group justify="space-between">
                  <Group gap="sm">
                    <Avatar size="sm" radius="xl" color="violet">
                      {member.profile?.full_name?.charAt(0)?.toUpperCase() ?? 'U'}
                    </Avatar>
                    <div>
                      <Text size="sm" fw={500}>
                        {member.profile?.full_name ?? 'Usuário'}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {member.profile?.email ?? ''}
                      </Text>
                    </div>
                  </Group>
                  {member.user_id === project?.owner_id ? (
                    <Text size="xs" c="dimmed" fw={500}>Owner</Text>
                  ) : (
                    <Text size="xs" c="dimmed">{member.role}</Text>
                  )}
                </Group>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Text size="sm" c="dimmed" ta="center" py="sm">
            Nenhum membro adicional neste projeto.
          </Text>
        )}

        <Button
          fullWidth
          onClick={handleSave}
          loading={syncMutation.isPending}
          style={{
            background: 'var(--gradient-brand)',
            border: 'none',
          }}
        >
          Salvar Alterações
        </Button>
      </Stack>
    </Modal>
  );
}
