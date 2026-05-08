import type { DesignTokens } from '@/types';

export const DEFAULT_TOKENS: DesignTokens = {
  colors: {
    brand: {
      name: 'brand',
      baseHex: '#F32B50',
      shades: ['#FEE9EF', '#FBC0CB', '#F99FB0', '#F67E95', '#F4577A', '#F32B50', '#981142', '#710E33', '#4B0921', '#260513'],
    },
    accent: {
      name: 'accent',
      baseHex: '#228BFC',
      shades: ['#EBF4FF', '#BEDDFB', '#91C6F8', '#64AFF5', '#3798F2', '#228BFC', '#1A6BC2', '#135099', '#0D376B', '#071D3D'],
    },
    tertiary: {
      name: 'tertiary',
      baseHex: '#7631EC',
      shades: ['#F3EBFF', '#D9C4FB', '#BF9DF7', '#A576F3', '#8B4FEF', '#7631EC', '#5C20C0', '#451893', '#2E1066', '#170839'],
    },
    gray: {
      name: 'gray',
      baseHex: '#6B7280',
      shades: ['#F8F9FA', '#EDEFF1', '#E0E3E6', '#C7CCD1', '#A6ADB5', '#808990', '#666E75', '#4D5359', '#33383D', '#1E2124'],
    },
    feedback: {
      error: {
        name: 'error',
        baseHex: '#EF4444',
        shades: ['#FEF2F2', '#FEE2E2', '#FECACA', '#FCA5A5', '#F87171', '#EF4444', '#DC2626', '#B91C1C', '#991B1B', '#7F1D1D'],
      },
      success: {
        name: 'success',
        baseHex: '#22C55E',
        shades: ['#F0FDF4', '#DCFCE7', '#BBF7D0', '#86EFAC', '#4ADE80', '#22C55E', '#16A34A', '#15803D', '#166534', '#14532D'],
      },
      warning: {
        name: 'warning',
        baseHex: '#F59E0B',
        shades: ['#FFFBEB', '#FEF3C7', '#FDE68A', '#FCD34D', '#FBBF24', '#F59E0B', '#D97706', '#B45309', '#92400E', '#78350F'],
      },
      info: {
        name: 'info',
        baseHex: '#3B82F6',
        shades: ['#EFF6FF', '#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A'],
      },
    },
  },
  radius: {
    scale: {
      none: 0,
      xs: 2,
      sm: 4,
      md: 6,
      lg: 8,
      xl: 12,
      full: 9999,
    },
    components: {
      button: 'sm',
      input: 'sm',
      card: 'md',
      modal: 'lg',
      badge: 'xl',
      pill: 'full',
    },
  },
  typography: {
    fonts: {
      base: 'Montserrat',
      mono: 'JetBrains Mono',
    },
    sizes: {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 18,
      '2xl': 20,
      '3xl': 24,
      '4xl': 34,
      '5xl': 48,
      '6xl': 60,
    },
    weights: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },
  spacing: {
    none: 0,
    '2xs': 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
  },
  shadows: {
    xs: { x: 0, y: 1, blur: 2, spread: 0 },
    sm: { x: 0, y: 1, blur: 3, spread: 0 },
    md: { x: 0, y: 4, blur: 6, spread: -1 },
    lg: { x: 0, y: 10, blur: 15, spread: -3 },
    xl: { x: 0, y: 20, blur: 25, spread: -5 },
  },
};
