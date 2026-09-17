import { Film } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-hmdbd-surface border-t border-gray-800 py-8 mt-12 hidden md:block">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-gray-400">
          <Film size={20} className="text-hmdbd-orange" />
          <span className="font-bold tracking-wider text-white">HMDBD</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/search" className="hover:text-white transition-colors">Search</Link>
          <Link to="/watchlist" className="hover:text-white transition-colors">Watchlist</Link>
        </div>

        <div className="text-sm text-gray-500 text-right">
          Powered by TMDB API.<br />
          Not affiliated with any streaming service.
        </div>
      </div>
    </footer>
  );
}
