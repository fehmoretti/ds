import { useState } from 'react';
import { LoginForm, SignupForm, LandingPage } from './components';

export function AuthPage() {
  const [mode, setMode] = useState<'landing' | 'login' | 'signup'>('landing');

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
  };

  if (mode === 'landing') {
    return <LandingPage onStart={() => setMode('login')} />;
  }

  if (mode === 'signup') {
    return <SignupForm onToggleMode={toggleMode} />;
  }

  return <LoginForm onToggleMode={toggleMode} />;
}
