export interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
  media_type?: string;
  genre_ids?: number[];
  popularity?: number;
}

export interface TmdbPageResponse {
  page: number;
  results: MediaItem[];
  total_pages: number;
  total_results: number;
}

export interface GenreDto {
  id: number;
  name: string;
}

export interface MediaDetailDto {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  tagline?: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  genres?: GenreDto[];
}

export interface CastMemberDto {
  id: number;
  name: string;
  character?: string;
  profile_path?: string;
}

export interface CreditsResponse {
  id: number;
  cast: CastMemberDto[];
}

export interface VideoDto {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface VideosResponse {
  id: number;
  results: VideoDto[];
}

export interface StoredMedia {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  voteAverage: number;
  releaseYear: string;
  overview: string;
  isWatchlist: boolean;
  isFavorite: boolean;
  watchProgress: number; // 0.0 to 1.0
  lastWatchedTimestamp: number;
  addedTimestamp: number;
}
