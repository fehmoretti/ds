import { ThemeProvider, QueryProvider, AuthProvider, TokensProvider } from '@/providers';
import { App } from './App';

export function AppProviders() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <TokensProvider>
            <App />
          </TokensProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
