import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import { MediaItem } from '../types';

export default function MediaCard({ item }: { item: MediaItem }) {
  const navigate = useNavigate();
  const type = item.media_type || (item.title ? 'movie' : 'tv');
  const title = item.title || item.name || 'Untitled';
  const posterUrl = item.poster_path 
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  const date = item.release_date || item.first_air_date || '';
  const year = date.length >= 4 ? date.substring(0, 4) : '';

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Open ad in new tab, navigate current tab to details
    window.open('https://www.profitableratecpmnetwork.com/xxfn6fg10?key=9c83f364401eaf30792f6057fce42102', '_blank');
    navigate(`/${type}/${item.id}`);
  };

  return (
    <div onClick={handleCardClick} className="group relative block rounded-xl overflow-hidden aspect-[2/3] bg-hmdbd-surface cursor-pointer">
      <img 
        src={posterUrl} 
        alt={title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
        <div className="w-10 h-10 rounded-full bg-hmdbd-orange flex items-center justify-center mb-2 mx-auto transform translate-y-4 group-hover:translate-y-0 transition-transform">
          <Play size={20} fill="currentColor" className="ml-1" />
        </div>
        <h3 className="text-sm font-bold text-white truncate">{title}</h3>
        <div className="flex items-center justify-between mt-1 text-xs text-gray-300">
          <span>{year}</span>
          <span className="uppercase text-[10px] font-bold tracking-wider text-hmdbd-orange-light">{type}</span>
        </div>
      </div>
      
      {item.vote_average && item.vote_average > 0 ? (
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md">
          ⭐ {item.vote_average.toFixed(1)}
        </div>
      ) : null}
    </div>
  );
}
