import { clsx } from 'clsx';

export interface ColorFilterButtonVariantProps {
  isSelected?: boolean;
}

export function getColorFilterButtonClassName(props: ColorFilterButtonVariantProps): string {
  const { isSelected } = props;

  return clsx('px-3 py-1.5 rounded-full border-2 text-sm font-medium transition-all', {
    'shadow-md': isSelected,
    'hover:shadow-sm': !isSelected,
  });
}
