import { clsx } from 'clsx';

export interface ErrorMessageVariantProps {
  variant?: 'default' | 'danger';
}

export function getErrorMessageClassName(props: ErrorMessageVariantProps): string {
  const { variant = 'default' } = props;

  return clsx('flex min-h-screen items-center justify-center p-4', {
    'bg-gray-50': variant === 'default',
    'bg-red-50': variant === 'danger',
  });
}
