import { useColorList } from '../../hooks/useColorList';
import { getColorPickerClassName } from './variants';
import type { ColorPickerProps } from './types';

/**
 * @component ColorPicker
 * @summary Color picker component for selecting note colors
 * @domain color
 * @type domain-component
 * @category form
 */
export const ColorPicker = ({ selectedColorId, onColorSelect, disabled }: ColorPickerProps) => {
  const { colors, isLoading } = useColorList();

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading colors...</div>;
  }

  if (!colors || colors.length === 0) {
    return <div className="text-sm text-gray-500">No colors available</div>;
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Color</label>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color.idColor}
            type="button"
            onClick={() => onColorSelect(color.idColor)}
            disabled={disabled}
            className={getColorPickerClassName({
              hexCode: color.hexCode,
              isSelected: selectedColorId === color.idColor,
              disabled,
            })}
            title={color.name}
            aria-label={`Select ${color.name} color`}
          >
            {selectedColorId === color.idColor && (
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
