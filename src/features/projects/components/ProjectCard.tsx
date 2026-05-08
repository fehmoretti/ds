import {
  Card,
  Text,
  Group,
  ActionIcon,
  Tooltip,
  Badge,
  Box,
  Image,
} from '@mantine/core';
import { IconTrash, IconCalendar, IconPalette, IconUsers } from '@tabler/icons-react';
import type { Project } from '@/services/projects.service';

interface ProjectCardProps {
  project: Project;
  onOpen: (projectId: string) => void;
  onDelete: (projectId: string) => void;
  onManageMembers?: (project: Project) => void;
}

export function ProjectCard({ project, onOpen, onDelete, onManageMembers }: ProjectCardProps) {
  const updatedAt = new Date(project.updated_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const hasTokens = project.tokens_data !== null;

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
                w={32}
                h={32}
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
