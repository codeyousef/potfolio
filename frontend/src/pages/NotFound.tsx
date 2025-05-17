import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-bg text-white p-4">
      <div className="noise-overlay"></div>
      
      <h1 className="text-4xl md:text-6xl font-heading mb-6 text-highlight-color">404</h1>
      <p className="text-xl md:text-2xl mb-8">The page you're looking for doesn't exist.</p>
      
      <Link 
        to="/" 
        className="px-6 py-3 border border-highlight-color text-highlight-color hover:bg-highlight-color/10 transition-colors duration-300"
      >
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;