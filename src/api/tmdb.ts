import { TmdbPageResponse, MediaDetailDto, CreditsResponse, VideosResponse } from '../types';

const API_KEY = "93a5c52b939ffbcb3cd561c8a1f8b880";
const BASE_URL = "https://api.themoviedb.org/3";

export const getStreamUrl = (tmdbId: number, mediaType: string, serverIndex: number = 0): string => {
  const type = mediaType.toLowerCase() === 'tv' ? 'tv' : 'movie';
  switch (serverIndex) {
    case 0: return `https://vidsrc.me/embed/${type}?tmdb=${tmdbId}`;
    case 1: return `https://vidsrc.to/embed/${type}/${tmdbId}`;
    case 2: return `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`;
    case 3: return `https://www.2embed.cc/embed/${tmdbId}`;
    default: return `https://vidsrc.me/embed/${type}?tmdb=${tmdbId}`;
  }
};

const fetchApi = async <T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', API_KEY);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.status}`);
  }
  return response.json() as Promise<T>;
};

export const tmdbApi = {
  getTrending: (mediaType = "all", timeWindow = "day", page = 1) => 
    fetchApi<TmdbPageResponse>(`/trending/${mediaType}/${timeWindow}`, { page }),
    
  getPopularMovies: (page = 1) => fetchApi<TmdbPageResponse>('/movie/popular', { page }),
  getTopRatedMovies: (page = 1) => fetchApi<TmdbPageResponse>('/movie/top_rated', { page }),
  getNowPlayingMovies: (page = 1) => fetchApi<TmdbPageResponse>('/movie/now_playing', { page }),
  
  getPopularTv: (page = 1) => fetchApi<TmdbPageResponse>('/tv/popular', { page }),
  getTopRatedTv: (page = 1) => fetchApi<TmdbPageResponse>('/tv/top_rated', { page }),
  
  getMovieGenres: () => fetchApi<{genres: GenreDto[]}>('/genre/movie/list'),
  
  discoverByCategory: (category: string, page = 1) => {
    if (category === 'movies') {
      return fetchApi<TmdbPageResponse>('/discover/movie', { page, sort_by: 'popularity.desc' });
    } else if (category === 'tv' || category === 'series') {
      return fetchApi<TmdbPageResponse>('/discover/tv', { page, sort_by: 'popularity.desc' });
    } else if (category === 'anime') {
      return fetchApi<TmdbPageResponse>('/discover/tv', { page, with_genres: 16, with_original_language: 'ja', sort_by: 'popularity.desc' });
    } else if (category === 'adult') {
      // TMDB doesn't allow explicit porn, but this fetches R-rated romance/thriller for 18+ vibe
      return fetchApi<TmdbPageResponse>('/discover/movie', { page, include_adult: true, certification_country: 'US', certification: 'R', sort_by: 'popularity.desc' });
    }
    return fetchApi<TmdbPageResponse>('/discover/movie', { page });
  },
  
  searchMulti: (query: string, page = 1) => fetchApi<TmdbPageResponse>('/search/multi', { query, page }),
  discoverMoviesByGenre: (genreId: number, page = 1) => fetchApi<TmdbPageResponse>('/discover/movie', { with_genres: genreId, page, sort_by: 'popularity.desc' }),
  
  getMovieDetails: (id: number) => fetchApi<MediaDetailDto>(`/movie/${id}`),
  getTvDetails: (id: number) => fetchApi<MediaDetailDto>(`/tv/${id}`),
  
  getMovieCredits: (id: number) => fetchApi<CreditsResponse>(`/movie/${id}/credits`),
  getTvCredits: (id: number) => fetchApi<CreditsResponse>(`/tv/${id}/credits`),
  
  getMovieVideos: (id: number) => fetchApi<VideosResponse>(`/movie/${id}/videos`),
  getTvVideos: (id: number) => fetchApi<VideosResponse>(`/tv/${id}/videos`),
  
  getSimilarMovies: (id: number, page = 1) => fetchApi<TmdbPageResponse>(`/movie/${id}/similar`, { page }),
  getSimilarTv: (id: number, page = 1) => fetchApi<TmdbPageResponse>(`/tv/${id}/similar`, { page }),
};
