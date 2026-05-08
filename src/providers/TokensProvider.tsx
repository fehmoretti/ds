import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from 'react';
import type {
  DesignTokens,
  ColorPalette,
  RadiusScale,
  RadiusComponents,
  DesignTokenTypography,
  DesignTokenSpacing,
  DesignTokenShadows,
} from '@/types';
import { DEFAULT_TOKENS } from '@/lib/default-tokens';

// === ACTIONS ===
type TokenAction =
  | { type: 'SET_COLOR_PALETTE'; payload: { key: 'brand' | 'accent' | 'tertiary' | 'gray'; palette: ColorPalette } }
  | { type: 'SET_FEEDBACK_PALETTE'; payload: { key: 'error' | 'success' | 'warning' | 'info'; palette: ColorPalette } }
  | { type: 'SET_RADIUS_SCALE'; payload: RadiusScale }
  | { type: 'SET_RADIUS_COMPONENTS'; payload: RadiusComponents }
  | { type: 'SET_TYPOGRAPHY'; payload: DesignTokenTypography }
  | { type: 'SET_SPACING'; payload: DesignTokenSpacing }
  | { type: 'SET_SHADOWS'; payload: DesignTokenShadows }
  | { type: 'RESET_TOKENS' }
  | { type: 'LOAD_TOKENS'; payload: DesignTokens };

// === REDUCER ===
function tokensReducer(state: DesignTokens, action: TokenAction): DesignTokens {
  switch (action.type) {
    case 'SET_COLOR_PALETTE':
      return {
        ...state,
        colors: {
          ...state.colors,
          [action.payload.key]: action.payload.palette,
        },
      };
    case 'SET_FEEDBACK_PALETTE':
      return {
        ...state,
        colors: {
          ...state.colors,
          feedback: {
            ...state.colors.feedback,
            [action.payload.key]: action.payload.palette,
          },
        },
      };
    case 'SET_RADIUS_SCALE':
      return {
        ...state,
        radius: { ...state.radius, scale: action.payload },
      };
    case 'SET_RADIUS_COMPONENTS':
      return {
        ...state,
        radius: { ...state.radius, components: action.payload },
      };
    case 'SET_TYPOGRAPHY':
      return { ...state, typography: action.payload };
    case 'SET_SPACING':
      return { ...state, spacing: action.payload };
    case 'SET_SHADOWS':
      return { ...state, shadows: action.payload };
    case 'RESET_TOKENS':
      return DEFAULT_TOKENS;
    case 'LOAD_TOKENS':
      return action.payload;
    default:
      return state;
  }
}

// === CONTEXT ===
interface TokensContextValue {
  tokens: DesignTokens;
  dispatch: React.Dispatch<TokenAction>;
}

const TokensContext = createContext<TokensContextValue | undefined>(undefined);

interface TokensProviderProps {
  children: ReactNode;
}

export function TokensProvider({ children }: TokensProviderProps) {
  const [tokens, dispatch] = useReducer(tokensReducer, DEFAULT_TOKENS);

  return (
    <TokensContext.Provider value={{ tokens, dispatch }}>
      {children}
    </TokensContext.Provider>
  );
}

export function useTokens(): TokensContextValue {
  const context = useContext(TokensContext);
  if (context === undefined) {
    throw new Error('useTokens must be used within a TokensProvider');
  }
  return context;
}
