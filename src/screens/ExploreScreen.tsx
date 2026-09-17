import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { tmdbApi } from '../api/tmdb';
import { MediaItem } from '../types';
import MediaCard from '../components/MediaCard';
import AdBanner from '../components/AdBanner';

export default function ExploreScreen() {
  const { category } = useParams<{ category: string }>();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const titleMap: Record<string, string> = {
    movies: 'Explore Movies',
    tv: 'Explore TV Shows',
    series: 'Popular Series',
    anime: 'Anime Collection',
    adult: '18+ Adult Content'
  };

  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      try {
        const data = await tmdbApi.discoverByCategory(category || 'movies', 1);
        setItems(data.results.map(m => ({
          ...m,
          media_type: (category === 'tv' || category === 'series' || category === 'anime') ? 'tv' : 'movie'
        })));
        setPage(1);
      } catch (error) {
        console.error("Failed to load category:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitial();
  }, [category]);

  const loadMore = useCallback(async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await tmdbApi.discoverByCategory(category || 'movies', nextPage);
      setItems(prev => [
        ...prev,
        ...data.results.map(m => ({
          ...m,
          media_type: (category === 'tv' || category === 'series' || category === 'anime') ? 'tv' : 'movie'
        }))
      ]);
      setPage(nextPage);
    } catch (error) {
      console.error("Failed to load more items:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [category, page, loadingMore]);

  // Infinite Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 200 >= 
        document.documentElement.offsetHeight
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-hmdbd-orange"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 pt-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-white px-2 border-l-4 border-hmdbd-orange capitalize">
        {titleMap[category || 'movies'] || category}
      </h1>
      
      <AdBanner />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-8">
        {items.map((item, index) => (
          <MediaCard key={`explore-${item.id}-${index}`} item={item} />
        ))}
      </div>
      
      {loadingMore && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-hmdbd-orange"></div>
        </div>
      )}
    </div>
  );
}
