import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ColorPicker } from '@/domain/color/components/ColorPicker';
import type { NoteFormProps } from './types';

const noteSchema = z.object({
  titulo: z
    .string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  conteudo: z
    .string()
    .min(1, 'Conteúdo é obrigatório')
    .max(5000, 'Conteúdo deve ter no máximo 5000 caracteres'),
  idColor: z.number().int().positive(),
});

type NoteFormData = z.infer<typeof noteSchema>;

/**
 * @component NoteForm
 * @summary Form component for creating and editing notes
 * @domain note
 * @type domain-component
 * @category form
 */
export const NoteForm = ({ initialData, onSubmit, onCancel, isSubmitting }: NoteFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: initialData || {
      titulo: '',
      conteudo: '',
      idColor: 1,
    },
  });

  const selectedColorId = watch('idColor');

  const handleFormSubmit = async (data: NoteFormData) => {
    await onSubmit(data);
  };

  const handleColorSelect = (colorId: number) => {
    setValue('idColor', colorId, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
          Título
        </label>
        <input
          id="titulo"
          type="text"
          {...register('titulo')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        />
        {errors.titulo && <p className="text-red-600 text-sm mt-1">{errors.titulo.message}</p>}
      </div>

      <div>
        <label htmlFor="conteudo" className="block text-sm font-medium text-gray-700 mb-1">
          Conteúdo
        </label>
        <textarea
          id="conteudo"
          {...register('conteudo')}
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        />
        {errors.conteudo && <p className="text-red-600 text-sm mt-1">{errors.conteudo.message}</p>}
      </div>

      <div>
        <ColorPicker
          selectedColorId={selectedColorId}
          onColorSelect={handleColorSelect}
          disabled={isSubmitting}
        />
        {errors.idColor && <p className="text-red-600 text-sm mt-1">{errors.idColor.message}</p>}
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
};
