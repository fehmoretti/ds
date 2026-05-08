import { useState, useEffect } from 'react';
import {
  Stack,
  TextInput,
  Textarea,
  MultiSelect,
  Button,
  Group,
  Text,
  Box,
  Image,
  FileButton,
  ActionIcon,
  Alert,
  Card,
} from '@mantine/core';
import { IconUpload, IconX, IconCheck, IconAlertCircle, IconCamera } from '@tabler/icons-react';
import { useTeamsForSelect, useUsersForSelect } from '@/features/teams/hooks';
import {
  fetchProject,
  fetchProjectMembers,
  updateProject,
  uploadProjectLogo,
  syncProjectMembers,
} from '@/services/projects.service';
import { useAuth } from '@/providers';

interface ProjectSettingsProps {
  projectId: string;
  onProjectNameChange?: (name: string) => void;
  onLogoChange?: (url: string | null) => void;
}

export function ProjectSettings({ projectId, onProjectNameChange, onLogoChange }: ProjectSettingsProps) {
  const { user } = useAuth();
  const { data: teamsOptions } = useTeamsForSelect();
  const { data: usersOptions } = useUsersForSelect();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Load project data
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const [project, members] = await Promise.all([
          fetchProject(projectId),
          fetchProjectMembers(projectId),
        ]);
        if (cancelled) return;

        setName(project.name);
        setDescription(project.description ?? '');
        setLogoUrl(project.logo_url ?? null);

        // Separate current members into users (excluding owner)
        const memberUserIds = members
          .filter((m) => m.user_id !== project.owner_id)
          .map((m) => m.user_id);
        setSelectedUsers(memberUserIds);
      } catch {
        // data will show empty, user can still edit
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [projectId]);

  const handleLogoSelect = (file: File | null) => {
    if (!file || file.size > 2 * 1024 * 1024) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const clearLogo = () => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleSave = async () => {
    if (!name.trim() || name.trim().length < 3) return;

    setSaveError(null);
    setSaveSuccess(false);
    setIsSaving(true);

    try {
      // Update project name/description
      await updateProject(projectId, {
        name: name.trim(),
        description: description.trim() || null,
      });

      // Upload logo if changed
      if (logoFile) {
        const url = await uploadProjectLogo(projectId, logoFile);
        setLogoUrl(url);
        setLogoFile(null);
        if (logoPreview) URL.revokeObjectURL(logoPreview);
        setLogoPreview(null);
        onLogoChange?.(url);
      }

      // Sync members
      if (user) {
        await syncProjectMembers(projectId, user.id, selectedTeams, selectedUsers);
      }

      onProjectNameChange?.(name.trim());
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setSaveError('Falha ao salvar alterações. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const displayLogo = logoPreview ?? logoUrl;

  if (isLoading) {
    return (
      <Card padding="xl" radius="lg" className="surface-card">
        <Text c="dimmed" ta="center">Carregando dados do projeto...</Text>
      </Card>
    );
  }

  return (
    <Stack gap="xl" maw={600}>
      {saveError && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          color="red"
          variant="light"
          radius="lg"
          withCloseButton
          onClose={() => setSaveError(null)}
        >
          {saveError}
        </Alert>
      )}

      {/* Logo */}
      <Card padding="lg" radius="lg" className="surface-card">
        <Text size="sm" fw={600} mb="md">Logo do projeto</Text>
        <Group gap="md" align="flex-start">
          <Box pos="relative">
            <Box
              style={{
                width: 80,
                height: 80,
                borderRadius: 12,
                background: 'var(--surface-glass)',
                border: '2px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {displayLogo ? (
                <Image src={displayLogo} alt="Logo do projeto" w={80} h={80} fit="contain" />
              ) : (
                <IconCamera size={28} color="var(--text-tertiary)" />
              )}
            </Box>
            {displayLogo && (
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
            )}
          </Box>
          <Stack gap="xs">
            <FileButton onChange={handleLogoSelect} accept="image/png,image/jpeg,image/webp,image/svg+xml">
              {(props) => (
                <Button variant="light" size="xs" leftSection={<IconUpload size={14} />} {...props}>
                  {displayLogo ? 'Trocar logo' : 'Enviar logo'}
                </Button>
              )}
            </FileButton>
            <Text size="xs" c="dimmed">PNG, JPG, WebP ou SVG. Máx. 2MB.</Text>
          </Stack>
        </Group>
      </Card>

      {/* Info */}
      <Card padding="lg" radius="lg" className="surface-card">
        <Text size="sm" fw={600} mb="md">Informações</Text>
        <Stack gap="md">
          <TextInput
            label="Nome do projeto"
            placeholder="Ex: Design System App Mobile"
            required
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            error={name.trim().length > 0 && name.trim().length < 3 ? 'Mínimo 3 caracteres' : undefined}
          />
          <Textarea
            label="Descrição"
            placeholder="Descrição opcional do projeto"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
          />
        </Stack>
      </Card>

      {/* Access */}
      <Card padding="lg" radius="lg" className="surface-card">
        <Text size="sm" fw={600} mb="md">Acesso ao projeto</Text>
        <Text size="xs" c="dimmed" mb="md">
          Selecione equipes e/ou usuários que terão acesso a este projeto.
        </Text>
        <Stack gap="md">
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
        </Stack>
      </Card>

      <Button
        onClick={handleSave}
        loading={isSaving}
        leftSection={saveSuccess ? <IconCheck size={16} /> : undefined}
        color={saveSuccess ? 'green' : undefined}
        variant={saveSuccess ? 'light' : 'filled'}
        fullWidth
      >
        {saveSuccess ? 'Salvo!' : 'Salvar alterações'}
      </Button>
    </Stack>
  );
}
