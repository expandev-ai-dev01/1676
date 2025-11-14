import { useColorList } from '../../hooks/useColorList';
import { getColorFilterButtonClassName } from './variants';
import type { ColorFilterProps } from './types';

/**
 * @component ColorFilter
 * @summary Color filter component for filtering notes by color
 * @domain color
 * @type domain-component
 * @category filter
 */
export const ColorFilter = ({
  selectedColorIds,
  onColorToggle,
  onClearFilters,
}: ColorFilterProps) => {
  const { colors, isLoading } = useColorList();

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading filters...</div>;
  }

  if (!colors || colors.length === 0) {
    return null;
  }

  const hasActiveFilters = selectedColorIds.length > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">Filter by Color</label>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear filters
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => {
          const isSelected = selectedColorIds.includes(color.idColor);
          return (
            <button
              key={color.idColor}
              type="button"
              onClick={() => onColorToggle(color.idColor)}
              className={getColorFilterButtonClassName({ isSelected })}
              style={{
                backgroundColor: isSelected ? color.hexCode : 'transparent',
                borderColor: color.hexCode,
                color: isSelected ? '#ffffff' : '#1f2937',
              }}
            >
              {color.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
