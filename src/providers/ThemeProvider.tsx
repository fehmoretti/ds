import {
  MantineProvider,
  createTheme,
  type MantineColorsTuple,
  type MantineColorSchemeManager,
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import type { ReactNode } from 'react';

import '@mantine/core/styles.layer.css';
import '@mantine/notifications/styles.layer.css';
import '@/styles/global.css';

// Brand palette based on #F32B50
const brand: MantineColorsTuple = [
  '#fff0f3',
  '#ffdeE4',
  '#fbb1c1',
  '#f6829c',
  '#f35a7c',
  '#f23d63',
  '#F32B50',
  '#d9213f',
  '#c21a35',
  '#aa102a',
];

const theme = createTheme({
  primaryColor: 'brand',
  colors: {
    brand,
    dark: [
      '#C9C9C9',
      '#b8b8b8',
      '#828282',
      '#696969',
      '#424242',
      '#3b3b3b',
      '#2e2e2e',
      '#242424',
      '#1f1f1f',
      '#141414',
    ],
  },
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  fontFamilyMonospace: 'JetBrains Mono, Fira Code, monospace',
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
    fontWeight: '600',
  },
  defaultRadius: 'md',
  radius: {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  shadows: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.04)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.03)',
  },
  other: {
    transitionDuration: '150ms',
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
        variant: 'filled',
        color: 'brand',
      },
      styles: {
        root: {
          fontWeight: 500,
          transition: 'all 150ms ease',
        },
      },
    },
    Card: {
      defaultProps: {
        radius: 'lg',
      },
    },
    Paper: {
      defaultProps: {
        radius: 'lg',
      },
    },
    ActionIcon: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        root: {
          transition: 'all 150ms ease',
        },
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    PasswordInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    Textarea: {
      defaultProps: {
        radius: 'md',
      },
    },
    Select: {
      defaultProps: {
        radius: 'md',
      },
    },
    NumberInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    Modal: {
      defaultProps: {
        radius: 'lg',
      },
    },
    Tabs: {
      styles: {
        tab: {
          fontWeight: 500,
          transition: 'all 150ms ease',
        },
      },
    },
  },
});

interface ThemeProviderProps {
  children: ReactNode;
}

// Lock to dark mode without suppressing light CSS generation
const darkSchemeManager: MantineColorSchemeManager = {
  get: () => 'dark',
  set: () => {},
  subscribe: () => {},
  unsubscribe: () => {},
  clear: () => {},
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark" colorSchemeManager={darkSchemeManager}>
      <Notifications position="top-right" />
      {children}
    </MantineProvider>
  );
}
