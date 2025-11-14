import { clsx } from 'clsx';

export interface ColorPickerVariantProps {
  hexCode: string;
  isSelected?: boolean;
  disabled?: boolean;
}

export function getColorPickerClassName(props: ColorPickerVariantProps): string {
  const { isSelected, disabled } = props;

  return clsx('w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all', {
    'border-gray-900 ring-2 ring-blue-500': isSelected,
    'border-gray-300 hover:border-gray-400': !isSelected && !disabled,
    'opacity-50 cursor-not-allowed': disabled,
    'cursor-pointer': !disabled,
  });
}
