import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Bookmark, BookmarkCheck, ArrowLeft, Star, Download, Users } from 'lucide-react';
import { tmdbApi } from '../api/tmdb';
import { MediaDetailDto, CastMemberDto, MediaItem } from '../types';
import { useMediaStore } from '../store/useMediaStore';
import AdBanner from '../components/AdBanner';
import MediaCard from '../components/MediaCard';

export default function DetailScreen() {
  const { type, id } = useParams<{ type: 'movie' | 'tv'; id: string }>();
  const navigate = useNavigate();
  const [details, setDetails] = useState<MediaDetailDto | null>(null);
  const [cast, setCast] = useState<CastMemberDto[]>([]);
  const [similar, setSimilar] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { savedMedia, addToWatchlist, removeFromWatchlist } = useMediaStore();
  const mediaId = Number(id);
  const isSaved = !!savedMedia[`${type}_${mediaId}`]?.isWatchlist;

  useEffect(() => {
    if (!type || !id) return;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const [detailsData, creditsData, similarData] = await Promise.all([
          type === 'movie' ? tmdbApi.getMovieDetails(mediaId) : tmdbApi.getTvDetails(mediaId),
          type === 'movie' ? tmdbApi.getMovieCredits(mediaId) : tmdbApi.getTvCredits(mediaId),
          type === 'movie' ? tmdbApi.getSimilarMovies(mediaId) : tmdbApi.getSimilarTv(mediaId)
        ]);
        
        setDetails(detailsData);
        setCast(creditsData.cast.slice(0, 15));
        setSimilar(similarData.results.filter(m => m.poster_path).slice(0, 12).map(m => ({...m, media_type: type})));
      } catch (error) {
        console.error("Failed to fetch details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [type, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-hmdbd-orange"></div>
      </div>
    );
  }

  if (!details) {
    return <div className="text-center py-20 text-gray-400">Media not found</div>;
  }

  const title = details.title || details.name || 'Untitled';
  const backdropUrl = details.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
    : 'https://via.placeholder.com/1280x720?text=No+Backdrop';
  const posterUrl = details.poster_path 
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  const releaseYear = (details.release_date || details.first_air_date || '').substring(0, 4);

  const handleToggleWatchlist = () => {
    if (isSaved) {
      removeFromWatchlist(mediaId, type!);
    } else {
      addToWatchlist({
        tmdbId: mediaId,
        mediaType: type!,
        title,
        posterPath: details.poster_path || null,
        backdropPath: details.backdrop_path || null,
        voteAverage: details.vote_average || 0,
        releaseYear,
        overview: details.overview || ''
      });
    }
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://www.profitableratecpmnetwork.com/xxfn6fg10?key=9c83f364401eaf30792f6057fce42102', '_blank');
    navigate(`/play/${type}/${mediaId}`);
  };

  return (
    <div className="pb-20">
      <div className="relative h-[50vh] md:h-[60vh] w-full">
        <img 
          src={backdropUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-hmdbd-dark via-hmdbd-dark/60 to-transparent"></div>
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-hmdbd-orange transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-32 relative z-10 flex flex-col md:flex-row gap-6 md:gap-10">
        <div className="w-32 md:w-64 flex-shrink-0 mx-auto md:mx-0">
          <img 
            src={posterUrl} 
            alt={title} 
            className="w-full rounded-xl shadow-2xl border border-gray-800"
          />
        </div>

        <div className="flex-1 mt-4 md:mt-16 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{title}</h1>
          
          <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-300 mb-6 font-medium">
            <span>{releaseYear}</span>
            {details.runtime ? <span>{details.runtime} min</span> : null}
            <span className="flex items-center text-yellow-500">
              <Star size={16} className="mr-1 fill-current" />
              {details.vote_average?.toFixed(1)}
            </span>
            <span className="uppercase tracking-wider px-2 py-0.5 bg-hmdbd-surface-variant rounded text-hmdbd-orange-light text-xs font-bold">
              {type}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8">
            <button 
              onClick={handlePlayClick}
              className="flex items-center gap-2 px-8 py-3 bg-hmdbd-orange text-white rounded-full font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-hmdbd-orange/30"
            >
              <Play fill="currentColor" size={20} />
              Play Now
            </button>
            <a 
              href="https://www.profitableratecpmnetwork.com/xxfn6fg10?key=9c83f364401eaf30792f6057fce42102"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-hmdbd-surface border border-gray-600 text-white rounded-full font-bold hover:bg-gray-800 transition-colors"
            >
              <Download size={20} />
              Download HD
            </a>
            <button 
              onClick={handleToggleWatchlist}
              className={`p-3 rounded-full border transition-colors ${
                isSaved 
                  ? 'bg-hmdbd-orange border-hmdbd-orange text-white' 
                  : 'bg-hmdbd-surface border-gray-600 text-gray-300 hover:text-white hover:border-gray-400'
              }`}
            >
              {isSaved ? <BookmarkCheck size={24} /> : <Bookmark size={24} />}
            </button>
          </div>

          <AdBanner />

          <div className="mb-6 mt-6">
            <h3 className="text-lg font-bold text-white mb-2">Overview</h3>
            <p className="text-gray-300 leading-relaxed max-w-3xl text-left">
              {details.overview || 'No overview available.'}
            </p>
          </div>

          {details.genres && details.genres.length > 0 && (
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-8">
              {details.genres.map(g => (
                <span key={g.id} className="px-3 py-1 bg-hmdbd-surface rounded-full text-sm text-gray-300 border border-gray-800">
                  {g.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16 space-y-12">
        {/* Cast Section */}
        {cast.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Users size={24} className="text-hmdbd-orange" />
              <h2 className="text-xl md:text-2xl font-bold text-white">Top Cast</h2>
            </div>
            <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-4">
              {cast.map(actor => (
                <div key={actor.id} className="flex-none w-28 md:w-36 flex flex-col items-center bg-hmdbd-surface p-3 rounded-xl border border-gray-800">
                  <img 
                    src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 'https://via.placeholder.com/200x300?text=No+Photo'} 
                    alt={actor.name} 
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover mb-3 shadow-lg"
                  />
                  <h4 className="text-sm font-bold text-white text-center leading-tight mb-1">{actor.name}</h4>
                  <p className="text-xs text-gray-400 text-center line-clamp-2">{actor.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar Movies Section */}
        {similar.length > 0 && (
          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-white px-2 border-l-4 border-hmdbd-orange">
              Similar {type === 'movie' ? 'Movies' : 'TV Shows'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {similar.map(item => (
                <MediaCard key={`similar-${item.id}`} item={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
