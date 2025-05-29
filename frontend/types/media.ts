export interface Media {
  id: string;
  title: string;
  description: string;
  releaseYear: number;
  genre: string[];
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  totalComments: number;
  averageRating: number;
  cast: string[];
}

export interface Movie extends Media {
  duration: number;
  director: string;
}

export interface TvShow extends Media {
  seasons: number;
  episodes: number;
  creator: string;
}


export interface Comment {
  id: string;
  content: string;
  author: string;
  avatar: string | null;
  rating: number;
  createdAt: string;
  movieId?: string;
  tvShowId?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
}
