import type { Color } from '../../types';

export interface ColorPickerProps {
  selectedColorId?: number;
  onColorSelect: (colorId: number) => void;
  disabled?: boolean;
}
