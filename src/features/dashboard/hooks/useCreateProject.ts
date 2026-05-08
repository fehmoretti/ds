import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProject } from '../services';
import { notifications } from '@mantine/notifications';

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['projects'] });
      notifications.show({
        title: 'Sucesso',
        message: 'Projeto criado com sucesso!',
        color: 'green',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Erro',
        message: 'Não foi possível criar o projeto. Tente novamente.',
        color: 'red',
      });
    },
  });
}
