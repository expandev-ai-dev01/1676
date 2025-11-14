export interface ColorFilterProps {
  selectedColorIds: number[];
  onColorToggle: (colorId: number) => void;
  onClearFilters: () => void;
}
