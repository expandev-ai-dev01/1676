import { useNavigate } from 'react-router-dom';

/**
 * @page HomePage
 * @summary Home page - main entry point for the application
 * @domain core
 * @type page-component
 * @category public
 */
export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to NoteDB</h1>
        <p className="text-lg text-gray-600 mb-8">Your minimalist notes manager</p>
        <button
          onClick={() => navigate('/notes')}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-lg font-medium"
        >
          View My Notes
        </button>
      </div>
    </div>
  );
};

export default HomePage;
