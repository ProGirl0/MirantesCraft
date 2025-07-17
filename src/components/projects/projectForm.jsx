import { useForm } from 'react-hook-form';
import AnimatedButton from '../ui/Button';

export const ProjectForm = ({ onSubmit }) => {
  const { register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} placeholder="Título" required />
      <textarea {...register('description')} placeholder="Descrição" />
      <AnimatedButton type="submit" variant="primary" size="medium" fullWidth>Salvar</AnimatedButton>
    </form>
  );
};