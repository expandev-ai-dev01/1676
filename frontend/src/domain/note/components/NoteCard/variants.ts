import { clsx } from 'clsx';

export interface NoteCardVariantProps {
  cor?: string;
}

export function getNoteCardClassName(props: NoteCardVariantProps): string {
  const { cor } = props;

  return clsx('p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md', {
    'bg-white border-gray-200': !cor || cor === 'branco',
    'bg-yellow-50 border-yellow-200': cor === 'amarelo',
    'bg-blue-50 border-blue-200': cor === 'azul',
    'bg-green-50 border-green-200': cor === 'verde',
    'bg-red-50 border-red-200': cor === 'vermelho',
    'bg-purple-50 border-purple-200': cor === 'roxo',
  });
}
