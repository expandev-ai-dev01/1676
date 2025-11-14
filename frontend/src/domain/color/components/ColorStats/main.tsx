import { useColorStats } from '../../hooks/useColorStats';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import type { ColorStatsProps } from './types';

/**
 * @component ColorStats
 * @summary Statistics component showing note count by color
 * @domain color
 * @type domain-component
 * @category display
 */
export const ColorStats = ({ className }: ColorStatsProps) => {
  const { stats, isLoading, error } = useColorStats();

  if (isLoading) {
    return <LoadingSpinner size="sm" />;
  }

  if (error) {
    return <div className="text-sm text-red-600">Failed to load statistics</div>;
  }

  if (!stats || stats.length === 0) {
    return <div className="text-sm text-gray-500">No statistics available</div>;
  }

  const totalNotes = stats.reduce((sum, stat) => sum + stat.noteCount, 0);

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes by Color</h3>
      <div className="space-y-2">
        {stats.map((stat) => {
          const percentage = totalNotes > 0 ? (stat.noteCount / totalNotes) * 100 : 0;
          return (
            <div key={stat.idColor} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: stat.hexCode }}
                title={stat.name}
              />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{stat.name}</span>
                  <span className="text-sm text-gray-600">
                    {stat.noteCount} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: stat.hexCode,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Total Notes</span>
          <span className="text-sm font-semibold text-gray-900">{totalNotes}</span>
        </div>
      </div>
    </div>
  );
};
