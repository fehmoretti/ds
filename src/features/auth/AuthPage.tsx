import { useState } from 'react';
import { LoginForm, SignupForm } from './components';

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
  };

  if (mode === 'signup') {
    return <SignupForm onToggleMode={toggleMode} />;
  }

  return <LoginForm onToggleMode={toggleMode} />;
}
