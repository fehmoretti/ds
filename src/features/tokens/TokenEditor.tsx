import { useState, useEffect, useCallback } from 'react';
import {
  AppShell,
  Container,
  Tabs,
  Group,
  Title,
  Text,
  ActionIcon,
  Tooltip,
  Button,
  Center,
  Loader,
  Alert,
  Box,
  Stack,
  Image,
} from '@mantine/core';
import {
  IconPalette,
  IconBorderRadius,
  IconTypography,
  IconSpacingHorizontal,
  IconShadow,
  IconEye,
  IconDownload,
  IconArrowBackUp,
  IconArrowLeft,
  IconDeviceFloppy,
  IconAlertCircle,
  IconCheck,
  IconSettings,
  IconShieldCheck,
} from '@tabler/icons-react';
import Logo from '@/assets/logo.svg?react';
import { useTokens } from '@/providers';
import { fetchProject, saveProjectTokens } from '@/services/projects.service';
import type { DesignTokens } from '@/types';
import {
  ColorsConfigurator,
  RadiusConfigurator,
  TypographyConfigurator,
  SpacingConfigurator,
  ShadowsConfigurator,
  TokenPreview,
  TokenExport,
  ProjectSettings,
  ContrastChecker,
} from './components';

type TabValue = 'settings' | 'colors' | 'radius' | 'typography' | 'spacing' | 'shadows' | 'preview' | 'contrast' | 'export';

interface TokenEditorProps {
  projectId: string;
  onBack: () => void;
}

export function TokenEditor({ projectId, onBack }: TokenEditorProps) {
  const [activeTab, setActiveTab] = useState<TabValue>('colors');
  const [projectName, setProjectName] = useState('');
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const { tokens, dispatch } = useTokens();

  useEffect(() => {
    let cancelled = false;

    async function loadProject() {
      setIsLoadingProject(true);
      try {
        const project = await fetchProject(projectId);
        if (cancelled) return;

        setProjectName(project.name);
        setLogoUrl(project.logo_url ?? null);

        if (project.tokens_data) {
          dispatch({
            type: 'LOAD_TOKENS',
            payload: project.tokens_data as unknown as DesignTokens,
          });
        } else {
          dispatch({ type: 'RESET_TOKENS' });
        }
      } catch {
        if (!cancelled) {
          setLoadError(true);
          setProjectName('Projeto');
        }
      } finally {
        if (!cancelled) {
          setIsLoadingProject(false);
        }
      }
    }

    loadProject();
    return () => { cancelled = true; };
  }, [projectId, dispatch]);

  const handleSave = useCallback(async () => {
    setSaveError(null);
    setSaveSuccess(false);
    setIsSaving(true);

    try {
      await saveProjectTokens(projectId, tokens as unknown as Record<string, unknown>);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setSaveError('Falha ao salvar tokens. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  }, [projectId, tokens]);

  const handleReset = () => {
    dispatch({ type: 'RESET_TOKENS' });
  };

  if (isLoadingProject) {
    return (
      <Center mih="100vh" style={{ background: 'var(--surface-base)' }}>
        <Stack align="center" gap="md">
          <Loader size="md" />
          <Text size="sm" c="dimmed">Carregando projeto...</Text>
        </Stack>
      </Center>
    );
  }

  if (loadError) {
    return (
      <Center mih="100vh" style={{ background: 'var(--surface-base)' }}>
        <Stack align="center" gap="md" maw={400}>
          <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" title="Erro ao carregar projeto">
            Não foi possível carregar os dados do projeto. Verifique sua conexão e tente novamente.
          </Alert>
          <Button variant="light" onClick={onBack}>
            Voltar para projetos
          </Button>
        </Stack>
      </Center>
    );
  }

  return (
    <AppShell header={{ height: 64 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="lg" justify="space-between">
          <Group gap="sm">
            <Tooltip label="Voltar para projetos" position="bottom">
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={onBack}
                size="lg"
                aria-label="Voltar para projetos"
              >
                <IconArrowLeft size={18} />
              </ActionIcon>
            </Tooltip>
            {logoUrl ? (
              <Box
                style={{
                  width: 36,
                  height: 36,
                  padding: 3,
                  borderRadius: 8,
                  background: 'var(--surface-glass)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <Image src={logoUrl} alt="Logo do projeto" w="100%" h="100%" fit="contain" />
              </Box>
            ) : (
              <Logo style={{ width: 22, height: 25 }} />
            )}
            <div>
              <Title order={5} fw={600} lh={1.2}>
                {projectName}
              </Title>
              <Text size="xs" c="dimmed">
                Design System DT
              </Text>
            </div>
          </Group>

          <Group gap="xs">
            <Tooltip label="Resetar para padrão" position="bottom">
              <ActionIcon variant="subtle" color="gray" onClick={handleReset} size="lg" aria-label="Resetar para padrão">
                <IconArrowBackUp size={18} />
              </ActionIcon>
            </Tooltip>
            <Button
              leftSection={saveSuccess ? <IconCheck size={16} /> : <IconDeviceFloppy size={16} />}
              size="xs"
              loading={isSaving}
              color={saveSuccess ? 'green' : undefined}
              variant={saveSuccess ? 'light' : 'filled'}
              onClick={handleSave}
            >
              {saveSuccess ? 'Salvo!' : 'Salvar'}
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="xl" py="lg">
          {saveError && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              variant="light"
              mb="lg"
              radius="lg"
              withCloseButton
              onClose={() => setSaveError(null)}
            >
              {saveError}
            </Alert>
          )}

          <Tabs
            value={activeTab}
            onChange={(val) => setActiveTab((val as TabValue) ?? 'colors')}
            variant="pills"
          >
            <Tabs.List mb="xl" style={{ overflowX: 'auto', flexWrap: 'nowrap' }}>
              <Tabs.Tab value="settings" leftSection={<IconSettings size={15} />}>
                Projeto
              </Tabs.Tab>
              <Tabs.Tab value="colors" leftSection={<IconPalette size={15} />}>
                Cores
              </Tabs.Tab>
              <Tabs.Tab value="radius" leftSection={<IconBorderRadius size={15} />}>
                Radius
              </Tabs.Tab>
              <Tabs.Tab value="typography" leftSection={<IconTypography size={15} />}>
                Tipografia
              </Tabs.Tab>
              <Tabs.Tab value="spacing" leftSection={<IconSpacingHorizontal size={15} />}>
                Espaçamento
              </Tabs.Tab>
              <Tabs.Tab value="shadows" leftSection={<IconShadow size={15} />}>
                Sombras
              </Tabs.Tab>
              <Tabs.Tab value="preview" leftSection={<IconEye size={15} />}>
                Preview
              </Tabs.Tab>
              <Tabs.Tab value="contrast" leftSection={<IconShieldCheck size={15} />}>
                Contraste
              </Tabs.Tab>
              <Tabs.Tab value="export" leftSection={<IconDownload size={15} />}>
                Exportar
              </Tabs.Tab>
            </Tabs.List>

            <Box className="animate-fade-in" key={activeTab}>
              <Tabs.Panel value="settings">
                <ProjectSettings
                  projectId={projectId}
                  onProjectNameChange={setProjectName}
                  onLogoChange={setLogoUrl}
                />
              </Tabs.Panel>

              <Tabs.Panel value="colors">
                <ColorsConfigurator />
              </Tabs.Panel>

              <Tabs.Panel value="radius">
                <RadiusConfigurator />
              </Tabs.Panel>

              <Tabs.Panel value="typography">
                <TypographyConfigurator />
              </Tabs.Panel>

              <Tabs.Panel value="spacing">
                <SpacingConfigurator />
              </Tabs.Panel>

              <Tabs.Panel value="shadows">
                <ShadowsConfigurator />
              </Tabs.Panel>

              <Tabs.Panel value="preview">
                <TokenPreview />
              </Tabs.Panel>

              <Tabs.Panel value="contrast">
                <ContrastChecker />
              </Tabs.Panel>

              <Tabs.Panel value="export">
                <TokenExport />
              </Tabs.Panel>
            </Box>
          </Tabs>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
