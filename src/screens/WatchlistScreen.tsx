import { useMediaStore } from '../store/useMediaStore';
import { Link } from 'react-router-dom';
import { Play, Trash2 } from 'lucide-react';
import { StoredMedia } from '../types';

export default function WatchlistScreen() {
  const { savedMedia, removeFromWatchlist } = useMediaStore();
  
  const watchlistItems = Object.values(savedMedia)
    .filter(item => item.isWatchlist)
    .sort((a, b) => b.addedTimestamp - a.addedTimestamp);

  return (
    <div className="p-4 md:p-8 pt-8">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">My Watchlist</h1>
      
      {watchlistItems.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="mb-4">Your watchlist is empty.</p>
          <Link to="/" className="text-hmdbd-orange hover:underline">Discover movies and shows</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {watchlistItems.map(item => (
            <WatchlistCard 
              key={`${item.mediaType}_${item.tmdbId}`} 
              item={item} 
              onRemove={() => removeFromWatchlist(item.tmdbId, item.mediaType)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function WatchlistCard({ item, onRemove }: { item: StoredMedia; onRemove: () => void }) {
  const posterUrl = item.posterPath 
    ? `https://image.tmdb.org/t/p/w500${item.posterPath}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  return (
    <div className="bg-hmdbd-surface rounded-xl overflow-hidden flex flex-col group relative border border-gray-800">
      <Link to={`/${item.mediaType}/${item.tmdbId}`} className="relative aspect-[2/3] block overflow-hidden">
        <img 
          src={posterUrl} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-hmdbd-orange flex items-center justify-center">
            <Play size={24} fill="currentColor" className="ml-1 text-white" />
          </div>
        </div>
      </Link>
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-white truncate mb-1" title={item.title}>{item.title}</h3>
        <div className="flex items-center justify-between mt-auto">
          <div className="text-xs text-gray-400 flex items-center gap-2">
            <span>{item.releaseYear}</span>
            <span className="uppercase text-[10px] font-bold text-hmdbd-orange-light">{item.mediaType}</span>
          </div>
          <button 
            onClick={(e) => {
              e.preventDefault();
              onRemove();
            }}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Remove from watchlist"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
