import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { tmdbApi } from '../api/tmdb';
import { MediaItem } from '../types';
import MediaCard from '../components/MediaCard';

export default function SearchScreen() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }
    
    const search = async () => {
      setLoading(true);
      try {
        const data = await tmdbApi.searchMulti(debouncedQuery);
        const filtered = data.results.filter(
          item => item.media_type === 'movie' || item.media_type === 'tv'
        );
        setResults(filtered);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };
    
    search();
  }, [debouncedQuery]);

  return (
    <div className="p-4 md:p-8 pt-8">
      <div className="relative mb-8 max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="text-gray-400" size={20} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setSearchParams(e.target.value ? { q: e.target.value } : {})}
          placeholder="Search movies, tv shows..."
          className="w-full bg-hmdbd-surface-variant text-white border-none rounded-full py-4 pl-12 pr-4 focus:ring-2 focus:ring-hmdbd-orange focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-hmdbd-orange"></div>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map((item) => (
            <MediaCard key={`${item.media_type}-${item.id}`} item={item} />
          ))}
        </div>
      ) : query.trim() ? (
        <div className="text-center text-gray-400 py-12">
          No results found for "{query}"
        </div>
      ) : (
        <div className="text-center text-gray-400 py-12">
          Type to start searching...
        </div>
      )}
    </div>
  );
}
