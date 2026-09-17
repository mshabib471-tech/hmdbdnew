import { NavLink, Link, useLocation } from 'react-router-dom';
import { Home, Search, Bookmark, Film, Tv, PlayCircle, Flame } from 'lucide-react';

export default function Navigation() {
  return (
    <>
      {/* Top Navbar (Desktop & Mobile) */}
      <nav className="fixed top-0 left-0 w-full bg-hmdbd-dark/95 backdrop-blur-md border-b border-gray-800 z-50 flex flex-col">
        {/* Main Header Row */}
        <div className="flex items-center justify-between px-4 md:px-8 h-16">
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl tracking-wider hover:text-hmdbd-orange transition-colors">
            <Film size={28} className="text-hmdbd-orange" />
            HMDBD
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <NavItem to="/" icon={<Home size={18} />} label="Home" desktop />
            <NavItem to="/explore/movies" icon={<Film size={18} />} label="Movies" desktop />
            <NavItem to="/explore/tv" icon={<Tv size={18} />} label="TV Shows" desktop />
            <NavItem to="/explore/anime" icon={<PlayCircle size={18} />} label="Anime" desktop />
            <NavItem to="/explore/adult" icon={<Flame size={18} />} label="18+" desktop />
            <NavItem to="/search" icon={<Search size={18} />} label="Search" desktop />
            <NavItem to="/watchlist" icon={<Bookmark size={18} />} label="Watchlist" desktop />
          </div>
        </div>

        {/* Mobile Categories Row */}
        <div className="md:hidden flex items-center overflow-x-auto hide-scrollbar gap-2 px-4 py-2 bg-hmdbd-surface border-t border-gray-800 h-[52px]">
          <MobileCat to="/explore/movies" label="Movies" />
          <MobileCat to="/explore/tv" label="TV Shows" />
          <MobileCat to="/explore/series" label="Series" />
          <MobileCat to="/explore/anime" label="Anime" />
          <MobileCat to="/explore/adult" label="18+" />
        </div>
      </nav>

      {/* Mobile Bottom Navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-hmdbd-surface/90 backdrop-blur-md border-t border-gray-800 z-50 flex items-center justify-around py-3">
        <NavItem to="/" icon={<Home size={24} />} label="Home" />
        <NavItem to="/search" icon={<Search size={24} />} label="Search" />
        <NavItem to="/watchlist" icon={<Bookmark size={24} />} label="Watchlist" />
      </nav>
    </>
  );
}

function NavItem({ to, icon, label, desktop }: { to: string; icon: React.ReactNode; label: string; desktop?: boolean }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex ${desktop ? 'flex-row gap-2' : 'flex-col'} items-center transition-colors ${
          isActive ? 'text-hmdbd-orange' : 'text-gray-400 hover:text-white'
        }`
      }
    >
      {icon}
      <span className={`${desktop ? 'text-sm font-medium' : 'text-[10px] mt-1'}`}>{label}</span>
    </NavLink>
  );
}

function MobileCat({ to, label }: { to: string; label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to}
      className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
        isActive 
          ? 'bg-hmdbd-orange border-hmdbd-orange text-white' 
          : 'bg-hmdbd-dark border-gray-700 text-gray-300 hover:border-gray-500'
      }`}
    >
      {label}
    </Link>
  );
}
