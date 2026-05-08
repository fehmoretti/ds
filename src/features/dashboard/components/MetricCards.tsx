import {
  SimpleGrid,
  Card,
  Text,
  Group,
  Badge,
  Skeleton,
  Stack,
  Alert,
} from '@mantine/core';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconMinus,
  IconBriefcase,
  IconChecklist,
  IconUsers,
  IconClock,
  IconAlertCircle,
} from '@tabler/icons-react';
import { useMetrics } from '../hooks';
import type { MetricCard as MetricCardType } from '../types';

const ICONS_MAP: Record<string, typeof IconBriefcase> = {
  '1': IconBriefcase,
  '2': IconChecklist,
  '3': IconUsers,
  '4': IconClock,
};

const TREND_COLORS: Record<MetricCardType['trend'], string> = {
  up: 'green',
  down: 'red',
  neutral: 'gray',
};

function TrendIcon({ trend }: { trend: MetricCardType['trend'] }) {
  const size = 14;
  switch (trend) {
    case 'up':
      return <IconTrendingUp size={size} />;
    case 'down':
      return <IconTrendingDown size={size} />;
    case 'neutral':
      return <IconMinus size={size} />;
  }
}

function MetricCardSkeleton() {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="sm">
        <Skeleton height={20} width="60%" />
        <Skeleton height={32} width="40%" />
        <Skeleton height={14} width="80%" />
        <Skeleton height={20} width="50%" />
      </Stack>
    </Card>
  );
}

function MetricCard({ metric }: { metric: MetricCardType }) {
  const Icon = ICONS_MAP[metric.id] ?? IconBriefcase;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Text size="sm" c="dimmed" fw={500}>
          {metric.title}
        </Text>
        <Icon size={20} color="var(--mantine-color-blue-6)" />
      </Group>

      <Text size="xl" fw={700}>
        {metric.value}
      </Text>

      <Text size="xs" c="dimmed" mt={4}>
        {metric.description}
      </Text>

      <Badge
        mt="sm"
        color={TREND_COLORS[metric.trend]}
        variant="light"
        leftSection={<TrendIcon trend={metric.trend} />}
      >
        {metric.trendValue}
      </Badge>
    </Card>
  );
}

export function MetricCards() {
  const { data: metrics, isLoading, isError } = useMetrics();

  if (isLoading) {
    return (
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="md">
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </SimpleGrid>
    );
  }

  if (isError) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Erro ao carregar métricas"
        color="red"
        variant="light"
      >
        Não foi possível carregar os dados. Tente novamente mais tarde.
      </Alert>
    );
  }

  if (!metrics || metrics.length === 0) {
    return (
      <Alert title="Sem dados" color="gray" variant="light">
        Nenhuma métrica disponível no momento.
      </Alert>
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="md">
      {metrics.map((metric) => (
        <MetricCard key={metric.id} metric={metric} />
      ))}
    </SimpleGrid>
  );
}
