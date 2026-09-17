import { NavLink, Link } from 'react-router-dom';
import { Home, Search, Bookmark, Film } from 'lucide-react';

export default function Navigation() {
  return (
    <>
      {/* Desktop Top Navbar */}
      <nav className="hidden md:flex fixed top-0 left-0 w-full h-16 bg-hmdbd-dark/95 backdrop-blur-md border-b border-gray-800 z-50 items-center justify-between px-8">
        <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl tracking-wider hover:text-hmdbd-orange transition-colors">
          <Film size={28} className="text-hmdbd-orange" />
          HMDBD
        </Link>
        <div className="flex items-center space-x-8">
          <NavItem to="/" icon={<Home size={20} />} label="Home" desktop />
          <NavItem to="/search" icon={<Search size={20} />} label="Search" desktop />
          <NavItem to="/watchlist" icon={<Bookmark size={20} />} label="Watchlist" desktop />
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
