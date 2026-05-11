import { ThemeProvider, QueryProvider, AuthProvider, TokensProvider, WcagModeProvider } from '@/providers';
import { App } from './App';

export function AppProviders() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <TokensProvider>
            <WcagModeProvider>
              <App />
            </WcagModeProvider>
          </TokensProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
