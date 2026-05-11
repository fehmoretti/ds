import {
  Card,
  Text,
  Group,
  ActionIcon,
  Tooltip,
  Badge,
  Box,
  Image,
  Menu,
} from '@mantine/core';
import { IconTrash, IconCalendar, IconPalette, IconUsers, IconDownload } from '@tabler/icons-react';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import type { Project } from '@/services/projects.service';
import type { DesignTokens } from '@/types';
import { downloadProjectArchive } from '@/lib/project-export';
import { applyContrastAdjustments } from '@/lib/semantic-tokens';
import type { WcagTarget } from '@/lib/contrast';

type ContrastMode = 'none' | WcagTarget;

interface ProjectCardProps {
  project: Project;
  onOpen: (projectId: string) => void;
  onDelete: (projectId: string) => void;
  onManageMembers?: (project: Project) => void;
}

export function ProjectCard({ project, onOpen, onDelete, onManageMembers }: ProjectCardProps) {
  const [exporting, setExporting] = useState(false);
  const updatedAt = new Date(project.updated_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const hasTokens = project.tokens_data !== null;

  const handleExportAll = async (mode: ContrastMode, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasTokens || exporting) return;
    setExporting(true);
    try {
      // tokens_data is stored as a JSON blob; assume it matches DesignTokens shape (it's
      // produced and consumed by this app via saveProjectTokens / TokensProvider).
      const baseTokens = project.tokens_data as unknown as DesignTokens;
      const tokens = mode === 'none' ? baseTokens : applyContrastAdjustments(baseTokens, mode);
      const fileSuffix = mode === 'none' ? '' : `-wcag-${mode.toLowerCase()}`;
      await downloadProjectArchive(tokens, { archiveBaseName: project.name, fileSuffix });
      notifications.show({
        title: 'Exportação concluída',
        message: `Arquivos do projeto "${project.name}" baixados${mode === 'none' ? '' : ` (WCAG ${mode})`}.`,
        color: 'brand',
      });
    } catch {
      notifications.show({
        title: 'Falha ao exportar',
        message: 'Não foi possível gerar o arquivo de exportação.',
        color: 'red',
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <Card
      padding="lg"
      radius="lg"
      className="surface-card"
      style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
      onClick={() => onOpen(project.id)}
    >
      {/* Top gradient accent */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: hasTokens ? 'var(--gradient-brand)' : 'var(--border-subtle)',
          borderRadius: '12px 12px 0 0',
        }}
      />

      <Group justify="space-between" mb="sm" mt={4}>
        <Group gap="sm">
          <Box
            style={{
              width: 32,
              height: 32,
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
            {project.logo_url ? (
              <Image
                src={project.logo_url}
                alt={`${project.name} logo`}
                w="100%"
                h="100%"
                fit="contain"
              />
            ) : (
              <IconPalette size={16} color="var(--mantine-color-brand-5)" />
            )}
          </Box>
          <Text fw={600} size="sm" lineClamp={1} style={{ flex: 1 }}>
            {project.name}
          </Text>
        </Group>
        <Group gap={4}>
          {hasTokens && (
            <Menu position="bottom-end" withArrow shadow="md" withinPortal>
              <Menu.Target>
                <ActionIcon
                  variant="subtle"
                  color="brand"
                  size="sm"
                  aria-label="Exportar todos os arquivos do projeto"
                  loading={exporting}
                  onClick={(e) => e.stopPropagation()}
                  style={{ opacity: 0.6, transition: 'opacity 150ms' }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6'; }}
                >
                  <IconDownload size={14} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown onClick={(e) => e.stopPropagation()}>
                <Menu.Label>Tipo de exportação</Menu.Label>
                <Menu.Item onClick={(e) => handleExportAll('none', e)}>
                  Padrão (sem ajuste)
                </Menu.Item>
                <Menu.Item onClick={(e) => handleExportAll('AA', e)}>
                  WCAG AA
                </Menu.Item>
                <Menu.Item onClick={(e) => handleExportAll('AAA', e)}>
                  WCAG AAA
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
          {onManageMembers && (
            <Tooltip label="Gerenciar acesso">
              <ActionIcon
                variant="subtle"
                color="blue"
                size="sm"
                aria-label="Gerenciar acesso"
                onClick={(e) => {
                  e.stopPropagation();
                  onManageMembers(project);
                }}
                style={{ opacity: 0.6, transition: 'opacity 150ms' }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6'; }}
              >
                <IconUsers size={14} />
              </ActionIcon>
            </Tooltip>
          )}
          <Tooltip label="Excluir projeto">
            <ActionIcon
              variant="subtle"
              color="red"
              size="sm"
              aria-label="Excluir projeto"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project.id);
              }}
              style={{ opacity: 0.6, transition: 'opacity 150ms' }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6'; }}
            >
              <IconTrash size={14} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      {project.description && (
        <Text size="xs" c="dimmed" lineClamp={2} mb="sm" lh={1.5}>
          {project.description}
        </Text>
      )}

      <Group justify="space-between" mt="auto" pt="sm" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <Group gap={4}>
          <IconCalendar size={11} color="var(--text-tertiary)" />
          <Text size="xs" c="dimmed">
            {updatedAt}
          </Text>
        </Group>
        <Badge
          size="xs"
          variant="light"
          color={hasTokens ? 'brand' : 'gray'}
          radius="sm"
        >
          {hasTokens ? 'Configurado' : 'Sem tokens'}
        </Badge>
      </Group>
    </Card>
  );
}
