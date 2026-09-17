import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import { tmdbApi } from '../api/tmdb';
import { MediaItem } from '../types';
import MediaCard from '../components/MediaCard';
import AdBanner from '../components/AdBanner';

export default function HomeScreen() {
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [popularMovies, setPopularMovies] = useState<MediaItem[]>([]);
  const [popularTv, setPopularTv] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingData, moviesData, tvData] = await Promise.all([
          tmdbApi.getTrending('all', 'day'),
          tmdbApi.getPopularMovies(1),
          tmdbApi.getPopularTv(1)
        ]);
        
        setTrending(trendingData.results);
        setPopularMovies(moviesData.results.map(m => ({ ...m, media_type: 'movie' })));
        setPopularTv(tvData.results.map(t => ({ ...t, media_type: 'tv' })));
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const loadMoreMovies = useCallback(async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const moviesData = await tmdbApi.getPopularMovies(nextPage);
      setPopularMovies(prev => [
        ...prev, 
        ...moviesData.results.map(m => ({ ...m, media_type: 'movie' }))
      ]);
      setPage(nextPage);
    } catch (error) {
      console.error("Failed to load more movies:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [page, loadingMore]);

  // Infinite Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 200 >= 
        document.documentElement.offsetHeight
      ) {
        loadMoreMovies();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreMovies]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-hmdbd-orange"></div>
      </div>
    );
  }

  const heroItem = trending[0];
  const gridTrending = trending.slice(1);

  return (
    <div className="pb-10 md:pb-20">
      {heroItem && <HeroSection item={heroItem} />}
      
      <div className="p-4 md:p-8 pt-8 space-y-12">
        <Section title="Trending Today" items={gridTrending} limit={12} />
        
        <AdBanner />
        
        <Section title="Popular TV Shows" items={popularTv} limit={12} />
        
        {/* Infinite scrolling section for All Movies */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-white px-2 border-l-4 border-hmdbd-orange">
            Explore All Movies
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {popularMovies.map((item, index) => (
              <MediaCard key={`pop-movie-${item.id}-${index}`} item={item} />
            ))}
          </div>
          {loadingMore && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-hmdbd-orange"></div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function HeroSection({ item }: { item: MediaItem }) {
  const navigate = useNavigate();
  const type = item.media_type || (item.title ? 'movie' : 'tv');
  const title = item.title || item.name || 'Untitled';
  const backdropUrl = item.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
    : 'https://via.placeholder.com/1280x720?text=No+Backdrop';
  const date = item.release_date || item.first_air_date || '';
  const year = date.length >= 4 ? date.substring(0, 4) : '';

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const hasClicked = sessionStorage.getItem(`ad_${item.id}`);
    if (!hasClicked) {
      sessionStorage.setItem(`ad_${item.id}`, 'true');
      window.open('https://www.profitableratecpmnetwork.com/xxfn6fg10?key=9c83f364401eaf30792f6057fce42102', '_blank');
      // Navigate to player in the current window seamlessly
      navigate(`/play/${type}/${item.id}`);
    } else {
      navigate(`/play/${type}/${item.id}`);
    }
  };

  return (
    <div className="relative w-full h-[60vh] md:h-[75vh] group">
      <img 
        src={backdropUrl} 
        alt={title} 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-hmdbd-dark via-hmdbd-dark/40 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-hmdbd-dark via-hmdbd-dark/60 to-transparent md:w-3/4"></div>
      
      <div className="absolute bottom-0 left-0 w-full p-4 md:p-12 z-10 flex flex-col justify-end">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 text-xs md:text-sm text-hmdbd-orange-light font-bold mb-3 tracking-wider uppercase">
            <span>#{item.popularity ? Math.round(item.popularity) : '1'} Trending</span>
            <span className="w-1.5 h-1.5 rounded-full bg-hmdbd-orange"></span>
            <span>{type}</span>
            {year && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-hmdbd-orange"></span>
                <span>{year}</span>
              </>
            )}
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
            {title}
          </h1>
          
          <p className="text-gray-300 md:text-lg mb-8 line-clamp-3 leading-relaxed max-w-xl">
            {item.overview}
          </p>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handlePlayClick}
              className="flex items-center gap-2 px-8 py-3.5 bg-hmdbd-orange text-white rounded-full font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-hmdbd-orange/30 text-lg"
            >
              <Play fill="currentColor" size={20} />
              Play Now
            </button>
            <Link 
              to={`/${type}/${item.id}`}
              className="flex items-center gap-2 px-8 py-3.5 bg-hmdbd-surface/80 hover:bg-hmdbd-surface text-white rounded-full font-bold backdrop-blur-md transition-colors border border-gray-700 hover:border-gray-500 text-lg"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, items, limit }: { title: string; items: MediaItem[]; limit?: number }) {
  if (!items.length) return null;
  const displayItems = limit ? items.slice(0, limit) : items;
  
  return (
    <section>
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-white px-2 border-l-4 border-hmdbd-orange">
        {title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {displayItems.map((item, index) => (
          <MediaCard key={`section-${item.media_type}-${item.id}-${index}`} item={item} />
        ))}
      </div>
    </section>
  );
}
