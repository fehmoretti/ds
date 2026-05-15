import {
  Modal,
  TextInput,
  Textarea,
  Button,
  Stack,
  MultiSelect,
  Text,
  Divider,
  FileButton,
  Group,
  Image,
  ActionIcon,
  Box,
} from '@mantine/core';
import { IconUpload, IconX } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useCreateProject } from '../hooks';
import { useTeamsForSelect, useUsersForSelect } from '@/features/teams/hooks';
import { createProjectSchema, type CreateProjectForm } from '../schemas';


interface CreateProjectModalProps {
  opened: boolean;
  onClose: () => void;
  onCreated?: (projectId: string) => void;
}

export function CreateProjectModal({ opened, onClose, onCreated }: CreateProjectModalProps) {
  const createProject = useCreateProject();
  const { data: teamsOptions } = useTeamsForSelect();
  const { data: usersOptions } = useUsersForSelect();
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectForm>({
    resolver: zodResolver(createProjectSchema),
  });

  const handleLogoSelect = (file: File | null) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return; // 2MB limit
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const clearLogo = () => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoFile(null);
    setLogoPreview(null);
  };

  const onSubmit = async (data: CreateProjectForm) => {
    const created = await createProject.mutateAsync({
      name: data.name,
      description: data.description || undefined,
      teamIds: selectedTeams,
      userIds: selectedUsers,
      logoFile: logoFile ?? undefined,
    });
    reset();
    setSelectedTeams([]);
    setSelectedUsers([]);
    clearLogo();
    onClose();
    onCreated?.(created.id);
  };

  const handleClose = () => {
    reset();
    setSelectedTeams([]);
    setSelectedUsers([]);
    clearLogo();
    onClose();
  };

  return (
    <Modal opened={opened} onClose={handleClose} title="Novo Projeto" centered size="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          {/* Logo upload */}
          <Box>
            <Text size="sm" fw={500} mb={4}>Logo do projeto</Text>
            <Group gap="sm" align="flex-end">
              {logoPreview ? (
                <Box pos="relative">
                  <Image
                    src={logoPreview}
                    alt="Logo preview"
                    w={64}
                    h={64}
                    radius="md"
                    fit="contain"
                    style={{ border: '1px solid var(--border-subtle)' }}
                  />
                  <ActionIcon
                    size="xs"
                    variant="filled"
                    color="red"
                    radius="xl"
                    pos="absolute"
                    top={-6}
                    right={-6}
                    onClick={clearLogo}
                    aria-label="Remover logo"
                  >
                    <IconX size={10} />
                  </ActionIcon>
                </Box>
              ) : (
                <Box
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 8,
                    border: '2px dashed var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconUpload size={20} color="var(--text-tertiary)" />
                </Box>
              )}
              <FileButton onChange={handleLogoSelect} accept="image/png,image/jpeg,image/webp,image/svg+xml">
                {(props) => (
                  <Button variant="light" size="xs" {...props}>
                    {logoPreview ? 'Trocar logo' : 'Enviar logo'}
                  </Button>
                )}
              </FileButton>
            </Group>
            <Text size="xs" c="dimmed" mt={4}>PNG, JPG, WebP ou SVG. Máx. 2MB.</Text>
          </Box>

          <TextInput
            label="Nome do projeto"
            placeholder="Ex: Design System App Mobile"
            required
            error={errors.name?.message}
            {...register('name')}
          />
          <Textarea
            label="Descrição"
            placeholder="Descrição opcional do projeto"
            rows={3}
            error={errors.description?.message}
            {...register('description')}
          />

          <Divider label="Acesso ao projeto" labelPosition="center" />

          <Text size="xs" c="dimmed">
            Selecione equipes e/ou usuários que terão acesso a este projeto.
          </Text>

          <MultiSelect
            label="Equipes"
            placeholder="Selecione equipes"
            data={teamsOptions ?? []}
            value={selectedTeams}
            onChange={setSelectedTeams}
            searchable
            clearable
          />

          <MultiSelect
            label="Usuários avulsos"
            placeholder="Selecione usuários"
            data={usersOptions ?? []}
            value={selectedUsers}
            onChange={setSelectedUsers}
            searchable
            clearable
          />

          <Button
            type="submit"
            fullWidth
            loading={createProject.isPending}
          >
            Criar Projeto
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
