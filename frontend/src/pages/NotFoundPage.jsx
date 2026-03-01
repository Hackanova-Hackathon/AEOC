import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

// File #42 - NotFoundPage.jsx
export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-[9rem] font-black leading-none bg-gradient-to-br from-blue-400 to-blue-700 bg-clip-text text-transparent select-none">
        404
      </h1>
      <h2 className="text-2xl font-bold text-white mt-2 mb-3">Page Not Found</h2>
      <p className="text-gray-400 text-sm max-w-xs mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button variant="primary" onClick={() => navigate('/dashboard')}>
        Return to Dashboard
      </Button>
    </div>
  );
}
