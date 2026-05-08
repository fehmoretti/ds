import {
  Modal,
  TextInput,
  Textarea,
  Select,
  Button,
  Group,
  Stack,
} from '@mantine/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProjectSchema, type CreateProjectSchema } from '../schemas';
import { useCreateProject } from '../hooks';

interface CreateProjectModalProps {
  opened: boolean;
  onClose: () => void;
}

export function CreateProjectModal({
  opened,
  onClose,
}: CreateProjectModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateProjectSchema>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      priority: '',
    },
  });

  const createProject = useCreateProject();

  const onSubmit = (data: CreateProjectSchema) => {
    createProject.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Novo Projeto"
      size="md"
      centered
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Nome do Projeto"
            placeholder="Ex: Redesign do Dashboard"
            required
            error={errors.name?.message}
            {...register('name')}
          />

          <Textarea
            label="Descrição"
            placeholder="Descreva o objetivo do projeto..."
            required
            minRows={3}
            error={errors.description?.message}
            {...register('description')}
          />

          <Select
            label="Categoria"
            placeholder="Selecione uma categoria"
            required
            data={[
              { value: 'development', label: 'Desenvolvimento' },
              { value: 'design', label: 'Design' },
              { value: 'marketing', label: 'Marketing' },
              { value: 'operations', label: 'Operações' },
            ]}
            error={errors.category?.message}
            onChange={(value) => setValue('category', value ?? '')}
          />

          <Select
            label="Prioridade"
            placeholder="Selecione a prioridade"
            required
            data={[
              { value: 'low', label: 'Baixa' },
              { value: 'medium', label: 'Média' },
              { value: 'high', label: 'Alta' },
              { value: 'critical', label: 'Crítica' },
            ]}
            error={errors.priority?.message}
            onChange={(value) => setValue('priority', value ?? '')}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={createProject.isPending}>
              Criar Projeto
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
