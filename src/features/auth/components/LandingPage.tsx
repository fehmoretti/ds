import {
  Stack,
  Title,
  Text,
  Button,
  Group,
  Paper,
  SimpleGrid,
  ThemeIcon,
  Container,
  Box,
  Badge,
  Grid,
} from '@mantine/core';
import {
  IconPalette,
  IconTypography,
  IconShadow,
  IconArrowRight,
  IconBrush,
  IconLetterA,
  IconStack2,
  IconSettings,
  IconCheck,
  IconBolt,
  IconDownload,
} from '@tabler/icons-react';
import { Logo } from '@/shared/components';

/* ── CSS Keyframes ── */
const keyframes = `
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 20px rgba(168,85,247,0.15); }
  50% { box-shadow: 0 0 40px rgba(168,85,247,0.3); }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

/* ── Editor Mockup ── */
function EditorMockup() {
  const brandShades = ['#3b0764', '#581c87', '#6b21a8', '#7e22ce', '#9333ea', '#a855f7', '#c084fc', '#d8b4fe', '#e9d5ff', '#f3e8ff'];
  const accentShades = ['#0a1628', '#122a4d', '#1a3f73', '#225399', '#2a68bf', '#3B82F6', '#6299f7', '#89b1f9', '#b1c9fb', '#d8e4fd'];

  return (
    <Paper
      radius="lg"
      style={{
        background: 'linear-gradient(145deg, #1a1a1a 0%, #151515 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        overflow: 'hidden',
        animation: 'float 6s ease-in-out infinite',
        maxWidth: 440,
        marginLeft: 'auto',
      }}
    >
      {/* Window bar */}
      <Group gap={6} px="md" py={10} justify="center" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative' }}>
        <Group gap={5} style={{ position: 'absolute', left: 14 }}>
          <Box style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
          <Box style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
          <Box style={{ width: 10, height: 10, borderRadius: '50%', background: '#28ca41' }} />
        </Group>
        <Text style={{ color: '#6b6b6b', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
          meu-projeto.json — DS Tokens Setup
        </Text>
      </Group>

      <Group align="stretch" gap={0} wrap="nowrap">
        {/* Sidebar */}
        <Stack gap="sm" py="md" px="xs" align="center" style={{ borderRight: '1px solid rgba(255,255,255,0.06)', minWidth: 38 }}>
          <Box style={{ padding: 4, borderRadius: 6, background: 'rgba(168,85,247,0.15)' }}>
            <IconBrush size={14} color="#a855f7" />
          </Box>
          <IconLetterA size={14} color="#6b6b6b" />
          <IconStack2 size={14} color="#6b6b6b" />
          <IconSettings size={14} color="#6b6b6b" />
        </Stack>

        {/* Content */}
        <Stack gap="sm" p="md" style={{ flex: 1, minWidth: 0 }}>
          {/* Brand */}
          <Box>
            <Text tt="uppercase" fw={700} mb={6} style={{ color: '#a855f7', letterSpacing: 1.5, fontSize: 10 }}>Brand · Purple</Text>
            <Group gap={3}>
              {brandShades.map((c, i) => (
                <Box key={i} style={{ width: 32, height: 32, borderRadius: 5, backgroundColor: c, border: i === 5 ? '2px solid rgba(255,255,255,0.8)' : '1px solid rgba(255,255,255,0.04)' }} />
              ))}
            </Group>
          </Box>

          {/* Accent */}
          <Box>
            <Text tt="uppercase" fw={700} mb={6} style={{ color: '#3B82F6', letterSpacing: 1.5, fontSize: 10 }}>Accent · Blue</Text>
            <Group gap={3}>
              {accentShades.map((c, i) => (
                <Box key={i} style={{ width: 32, height: 32, borderRadius: 5, backgroundColor: c, border: '1px solid rgba(255,255,255,0.04)' }} />
              ))}
            </Group>
          </Box>

          {/* Token rows */}
          <Stack gap={0} style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}>
            {[
              { key: 'color.brand.500', value: '#a855f7', dot: '#a855f7' },
              { key: 'font.size.base', value: '16px', dot: null },
              { key: 'radius.md', value: '8px', dot: null },
              { key: 'shadow.md', value: '0 4px 12px …', dot: null },
            ].map(({ key, value, dot }) => (
              <Group key={key} justify="space-between" py={5} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <Text style={{ color: '#6b6b6b', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{key}</Text>
                <Group gap={6}>
                  {dot && <Box style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: dot }} />}
                  <Text fw={500} style={{ color: '#e0e0e0', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{value}</Text>
                </Group>
              </Group>
            ))}
          </Stack>
        </Stack>
      </Group>
    </Paper>
  );
}

/* ── Workflow Step ── */
function WorkflowStep({ step, title, desc, color }: { step: number; title: string; desc: string; color: string }) {
  return (
    <Stack align="center" gap="sm" ta="center">
      <Box
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: `${color}15`,
          border: `1px solid ${color}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          fontWeight: 800,
          color,
        }}
      >
        {step}
      </Box>
      <Text fw={600} size="sm" style={{ color: '#f5f5f5' }}>{title}</Text>
      <Text size="xs" style={{ color: '#a1a1a1', lineHeight: 1.6, maxWidth: 200 }}>{desc}</Text>
    </Stack>
  );
}

/* ── Landing Page ── */

interface LandingPageProps {
  onStart: () => void;
  onSignup: () => void;
}

export function LandingPage({ onStart, onSignup }: LandingPageProps) {
  return (
    <>
      <style>{keyframes}</style>
      <Box
        style={{
          minHeight: '100vh',
          background: '#0c0c0c',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* ── HEADER ── */}
        <Group
          h={64}
          px="xl"
          justify="space-between"
          style={{
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(12px)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            background: 'rgba(12,12,12,0.8)',
          }}
        >
          <Group gap="sm">
            <Logo style={{ width: 22, height: 25 }} />
            <Text fw={700} size="sm" c="white">DS Tokens Setup</Text>
          </Group>
          <Group gap="md">
            <Button variant="subtle" color="gray" size="sm" onClick={onStart}>
              Entrar
            </Button>
            <Button size="sm" onClick={onSignup}>
              Cadastre-se
            </Button>
          </Group>
        </Group>

        {/* ── HERO ── */}
        <Box
          style={{
            background: 'radial-gradient(ellipse at 30% 20%, rgba(168,85,247,0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(59,130,246,0.06) 0%, transparent 50%)',
            position: 'relative',
          }}
        >
          {/* Glow orb */}
          <Box
            style={{
              position: 'absolute',
              top: -120,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 500,
              height: 500,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <Container size="lg" py={{ base: 60, sm: 100 }}>
            <Grid gap={{ base: 40, sm: 60 }} align="center">
              {/* Left */}
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Stack gap="lg" style={{ animation: 'fadeInUp 600ms ease' }}>
                  <Badge
                    variant="light"
                    color="brand"
                    size="lg"
                    radius="xl"
                    leftSection={<IconBolt size={12} />}
                    style={{ alignSelf: 'flex-start' }}
                  >
                    Editor visual de tokens
                  </Badge>

                  <Title
                    order={1}
                    fw={800}
                    style={{
                      color: '#f5f5f5',
                      fontSize: 'clamp(36px, 5vw, 56px)',
                      lineHeight: 1.1,
                      letterSpacing: '-0.03em',
                    }}
                  >
                    Configure seus{' '}
                    <Text
                      component="span"
                      inherit
                      style={{
                        background: 'linear-gradient(135deg, #a855f7 0%, #c084fc 50%, #3B82F6 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      Design Tokens
                    </Text>
                    <br />
                    em um só lugar.
                  </Title>

                  <Text size="lg" style={{ color: '#a1a1a1', maxWidth: 440, lineHeight: 1.7 }}>
                    Defina cores, tipografia, sombras e espaçamentos de forma visual.
                    Exporte tokens prontos para{' '}
                    <Text component="span" fw={600} style={{ color: '#f5f5f5' }}>Figma Variables</Text> e{' '}
                    <Text component="span" fw={600} style={{ color: '#f5f5f5' }}>Mantine</Text>.
                  </Text>

                  <Group gap="md" mt="xs">
                    <Button
                      size="xl"
                      rightSection={<IconArrowRight size={20} />}
                      onClick={onStart}
                      style={{ animation: 'pulseGlow 3s ease-in-out infinite' }}
                    >
                      Começar agora
                    </Button>
                  </Group>

                  {/* Tech badges */}
                  <Group gap="xs" mt="sm">
                    {['Mantine', 'Figma Variables', 'CSS Variables', 'Light & Dark'].map((t) => (
                      <Badge key={t} variant="dot" color="gray" size="md" radius="xl" style={{ color: '#828282' }}>
                        {t}
                      </Badge>
                    ))}
                  </Group>
                </Stack>
              </Grid.Col>

              {/* Right — Mockup */}
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Box
                  style={{
                    filter: 'drop-shadow(0 32px 64px rgba(168,85,247,0.15)) drop-shadow(0 16px 32px rgba(0,0,0,0.4))',
                    animation: 'fadeInUp 800ms ease 200ms both',
                  }}
                >
                  <EditorMockup />
                </Box>
              </Grid.Col>
            </Grid>
          </Container>
        </Box>

        {/* ── STATS ── */}
        <Box style={{ borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <Container size="lg" py={40}>
            <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="xl">
              {[
                { value: '10', label: 'Shades por cor', color: '#a855f7' },
                { value: '3', label: 'Formatos de export', color: '#3B82F6' },
                { value: '50+', label: 'Componentes', color: '#F59E0B' },
                { value: '∞', label: 'Projetos', color: '#10B981' },
              ].map(({ value, label, color }) => (
                <Stack key={label} align="center" gap={4}>
                  <Text fw={800} style={{ color, fontSize: 32, lineHeight: 1 }}>{value}</Text>
                  <Text size="xs" style={{ color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</Text>
                </Stack>
              ))}
            </SimpleGrid>
          </Container>
        </Box>

        {/* ── FEATURES ── */}
        <Container size="lg" py={{ base: 60, sm: 80 }}>
          <Stack align="center" gap="xs" mb={48}>
            <Text size="xs" tt="uppercase" fw={700} style={{ color: '#a855f7', letterSpacing: 2 }}>
              Recursos
            </Text>
            <Title order={2} fw={700} ta="center" style={{ color: '#f5f5f5', fontSize: 28 }}>
              Tudo que você precisa para criar seu Design System
            </Title>
            <Text size="sm" ta="center" style={{ color: '#6b6b6b', maxWidth: 500 }}>
              Editor visual completo com preview em tempo real e exportação em múltiplos formatos.
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="lg">
            {[
              {
                icon: IconPalette, color: '#a855f7', title: 'Cores & Paletas',
                desc: 'Primárias, secundárias, gray e feedbacks. Geração automática de 10 shades com suporte a Light & Dark.',
                features: ['Brand & Accent', 'Feedbacks semânticos', 'Auto-geração'],
              },
              {
                icon: IconTypography, color: '#3B82F6', title: 'Tipografia',
                desc: 'Famílias, tamanhos e pesos tipográficos em escala modular. Preview em tempo real.',
                features: ['Google Fonts', 'Escala modular', 'Font pairing'],
              },
              {
                icon: IconShadow, color: '#F59E0B', title: 'Sombras & Radius',
                desc: 'Elevação por nível, border-radius por componente e espaçamentos customizáveis.',
                features: ['5 níveis de sombra', 'Radius por componente', 'Spacing scale'],
              },
              {
                icon: IconDownload, color: '#10B981', title: 'Exportação',
                desc: 'Gere temas Mantine, CSS Variables e JSON para Figma Variables com um clique.',
                features: ['Mantine Theme', 'CSS Variables', 'Figma JSON'],
              },
            ].map(({ icon: Icon, color, title, desc, features }) => (
              <Paper
                key={title}
                p="xl"
                radius="lg"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  transition: 'all 300ms ease',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = `${color}40`;
                  el.style.transform = 'translateY(-4px)';
                  el.style.boxShadow = `0 12px 32px ${color}10`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(255,255,255,0.06)';
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = 'none';
                }}
              >
                <ThemeIcon size={44} radius="md" variant="light" mb="md" style={{ backgroundColor: `${color}12`, color }}>
                  <Icon size={22} />
                </ThemeIcon>
                <Text fw={700} size="sm" style={{ color: '#f5f5f5' }} mb={6}>{title}</Text>
                <Text size="xs" style={{ color: '#a1a1a1', lineHeight: 1.7 }} mb="md">{desc}</Text>
                <Stack gap={4}>
                  {features.map((f) => (
                    <Group key={f} gap={6}>
                      <IconCheck size={12} color={color} />
                      <Text size="xs" style={{ color: '#828282' }}>{f}</Text>
                    </Group>
                  ))}
                </Stack>
              </Paper>
            ))}
          </SimpleGrid>
        </Container>

        {/* ── WORKFLOW ── */}
        <Box style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <Container size="lg" py={{ base: 60, sm: 80 }}>
            <Stack align="center" gap="xs" mb={48}>
              <Text size="xs" tt="uppercase" fw={700} style={{ color: '#3B82F6', letterSpacing: 2 }}>
                Como funciona
              </Text>
              <Title order={2} fw={700} ta="center" style={{ color: '#f5f5f5', fontSize: 28 }}>
                Do zero ao export em 3 passos
              </Title>
            </Stack>

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
              <WorkflowStep step={1} title="Crie seu projeto" desc="Escolha um nome, defina equipe e comece com tokens padrão ou do zero." color="#a855f7" />
              <WorkflowStep step={2} title="Configure visualmente" desc="Use o editor interativo para ajustar cores, tipografia, sombras e espaçamentos." color="#3B82F6" />
              <WorkflowStep step={3} title="Exporte e use" desc="Gere código Mantine, CSS Variables ou JSON para Figma com um clique." color="#10B981" />
            </SimpleGrid>
          </Container>
        </Box>

        {/* ── PREVIEW SECTION ── */}
        <Container size="lg" py={{ base: 60, sm: 80 }}>
          <Grid gap={48} align="center">
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Stack gap="lg">
                <Badge variant="light" color="brand" size="md" radius="xl" style={{ alignSelf: 'flex-start' }}>
                  Preview em tempo real
                </Badge>
                <Title order={2} fw={700} style={{ color: '#f5f5f5', fontSize: 28 }}>
                  Veja as mudanças{' '}
                  <Text component="span" inherit style={{ color: '#a855f7' }}>instantaneamente</Text>
                </Title>
                <Text size="sm" style={{ color: '#a1a1a1', lineHeight: 1.7 }}>
                  Cada alteração nos tokens é refletida em tempo real no preview com mais de 50 componentes Mantine. Alterne entre Light e Dark mode para validar seu design system.
                </Text>
                <Stack gap="xs">
                  {[
                    'Preview com 50+ componentes Mantine',
                    'Alternar Light & Dark em tempo real',
                    'Tipografia, cores e espaçamentos lado a lado',
                  ].map((item) => (
                    <Group key={item} gap="xs">
                      <ThemeIcon size={20} radius="xl" color="brand" variant="light">
                        <IconCheck size={12} />
                      </ThemeIcon>
                      <Text size="sm" style={{ color: '#a1a1a1' }}>{item}</Text>
                    </Group>
                  ))}
                </Stack>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Paper
                radius="lg"
                p="lg"
                style={{
                  background: 'linear-gradient(145deg, #1a1a1a, #151515)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <SimpleGrid cols={3} spacing="xs">
                  {/* Buttons */}
                  <Stack gap="xs">
                    <Text tt="uppercase" fw={700} style={{ color: '#6b6b6b', letterSpacing: 1, fontSize: 9 }}>Buttons</Text>
                    <Box style={{ height: 28, borderRadius: 6, background: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Text fw={600} c="white" style={{ fontSize: 10 }}>Primário</Text>
                    </Box>
                    <Box style={{ height: 28, borderRadius: 6, background: 'rgba(168,85,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Text fw={600} style={{ color: '#a855f7', fontSize: 10 }}>Secundário</Text>
                    </Box>
                    <Box style={{ height: 28, borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Text fw={600} style={{ color: '#a1a1a1', fontSize: 10 }}>Outline</Text>
                    </Box>
                  </Stack>
                  {/* Inputs */}
                  <Stack gap="xs">
                    <Text tt="uppercase" fw={700} style={{ color: '#6b6b6b', letterSpacing: 1, fontSize: 9 }}>Inputs</Text>
                    <Box style={{ height: 28, borderRadius: 6, background: '#1f1f1f', border: '1px solid rgba(255,255,255,0.1)', paddingLeft: 8, display: 'flex', alignItems: 'center' }}>
                      <Text style={{ color: '#6b6b6b', fontSize: 10 }}>Nome...</Text>
                    </Box>
                    <Box style={{ height: 28, borderRadius: 6, background: '#1f1f1f', border: '1px solid #a855f7', paddingLeft: 8, display: 'flex', alignItems: 'center' }}>
                      <Text style={{ color: '#f5f5f5', fontSize: 10 }}>Focado</Text>
                    </Box>
                    <Box style={{ height: 28, borderRadius: 6, background: '#1f1f1f', border: '1px solid rgba(255,255,255,0.06)', paddingLeft: 8, display: 'flex', alignItems: 'center' }}>
                      <Text style={{ color: '#424242', fontSize: 10 }}>Disabled</Text>
                    </Box>
                  </Stack>
                  {/* Badges */}
                  <Stack gap="xs">
                    <Text tt="uppercase" fw={700} style={{ color: '#6b6b6b', letterSpacing: 1, fontSize: 9 }}>Badges</Text>
                    <Group gap={4}>
                      <Box style={{ height: 20, borderRadius: 10, background: 'rgba(168,85,247,0.15)', padding: '0 8px', display: 'flex', alignItems: 'center' }}>
                        <Text fw={600} style={{ color: '#a855f7', fontSize: 9 }}>Brand</Text>
                      </Box>
                      <Box style={{ height: 20, borderRadius: 10, background: 'rgba(59,130,246,0.15)', padding: '0 8px', display: 'flex', alignItems: 'center' }}>
                        <Text fw={600} style={{ color: '#3B82F6', fontSize: 9 }}>Info</Text>
                      </Box>
                    </Group>
                    <Group gap={4}>
                      <Box style={{ height: 20, borderRadius: 10, background: 'rgba(16,185,129,0.15)', padding: '0 8px', display: 'flex', alignItems: 'center' }}>
                        <Text fw={600} style={{ color: '#10B981', fontSize: 9 }}>Sucesso</Text>
                      </Box>
                      <Box style={{ height: 20, borderRadius: 10, background: 'rgba(245,158,11,0.15)', padding: '0 8px', display: 'flex', alignItems: 'center' }}>
                        <Text fw={600} style={{ color: '#F59E0B', fontSize: 9 }}>Alerta</Text>
                      </Box>
                    </Group>
                    <Box style={{ height: 6, borderRadius: 3, background: 'rgba(168,85,247,0.2)', overflow: 'hidden', marginTop: 4 }}>
                      <Box style={{ width: '65%', height: '100%', borderRadius: 3, background: '#a855f7' }} />
                    </Box>
                  </Stack>
                </SimpleGrid>
              </Paper>
            </Grid.Col>
          </Grid>
        </Container>

        {/* ── CTA FINAL ── */}
        <Box
          style={{
            background: 'radial-gradient(ellipse at 50% 100%, rgba(168,85,247,0.1) 0%, transparent 60%)',
            borderTop: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <Container size="sm" py={{ base: 60, sm: 80 }}>
            <Stack align="center" gap="lg" ta="center">
              <Logo style={{ width: 48, height: 54 }} />
              <Title order={2} fw={800} style={{ color: '#f5f5f5', fontSize: 32 }}>
                Pronto para criar seu Design System?
              </Title>
              <Text size="md" style={{ color: '#a1a1a1', maxWidth: 400 }}>
                Configure, visualize e exporte seus tokens em minutos.
              </Text>
              <Button
                size="xl"
                rightSection={<IconArrowRight size={20} />}
                onClick={onStart}
                style={{ animation: 'pulseGlow 3s ease-in-out infinite' }}
              >
                Começar agora
              </Button>
            </Stack>
          </Container>
        </Box>

        {/* ── FOOTER ── */}
        <Box style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <Container size="lg" py="lg">
            <Group justify="space-between">
              <Group gap="sm">
                <Logo style={{ width: 16, height: 18 }} />
                <Text size="xs" style={{ color: '#424242' }}>DS Tokens Setup</Text>
              </Group>
              <Text size="xs" style={{ color: '#424242' }}>
                Plataforma de gestão de Design Tokens
              </Text>
            </Group>
          </Container>
        </Box>
      </Box>
    </>
  );
}
