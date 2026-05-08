import { useState } from 'react';
import { Center, Loader } from '@mantine/core';
import { useAuth } from '@/providers';
import { AuthPage } from '@/features/auth';
import { ProjectsPage } from '@/features/projects';
import { TokenEditor } from '@/features/tokens';

type AppView = 'projects' | 'token-editor' | 'users' | 'teams' | 'profile';

export function App() {
  const { user, isLoading } = useAuth();
  const [activeView, setActiveView] = useState<AppView>('projects');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Center mih="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  if (activeView === 'token-editor' && activeProjectId) {
    return (
      <TokenEditor
        projectId={activeProjectId}
        onBack={() => {
          setActiveProjectId(null);
          setActiveView('projects');
        }}
      />
    );
  }

  return (
    <ProjectsPage
      onOpenProject={(id) => {
        setActiveProjectId(id);
        setActiveView('token-editor');
      }}
      activeView={activeView === 'token-editor' ? 'projects' : activeView}
      onNavigate={setActiveView}
    />
  );
}
