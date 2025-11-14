import { getErrorMessageClassName } from './variants';
import type { ErrorMessageProps } from './types';

/**
 * @component ErrorMessage
 * @summary Error message display component
 * @domain core
 * @type ui-component
 * @category feedback
 */
export const ErrorMessage = ({
  title = 'Error',
  message,
  onRetry,
  onBack,
  variant = 'default',
}: ErrorMessageProps) => {
  return (
    <div className={getErrorMessageClassName({ variant })}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-4 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          )}
          {onBack && (
            <button
              onClick={onBack}
              className="px-6 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 transition-colors"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
