import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Interaction, SupabaseService } from './supabase.service';
import { SessionService } from './session.service';

export interface RatedMoviesResponse {
  page: number;
  results: RatedMovie[];
  total_pages: number;
  total_results: number;
}

export interface RatedMovie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  rating: number;
}

export interface Genre{
  id: number;
  name: string;
}

export interface Review{
  id?: string,
  userId: string,
  movieId: number,
  rating: number,
  name: string,
  review?: string,
}


@Injectable({
  providedIn: 'root'
})
export class RatedmoviesService {
  private tmdbUrl = environment.tmdbUrl;
  private tmdbKey = environment.tmdbKey;
  private imgBaseUrl = environment.imgBaseUrl;

  ratedMoviesResponse: RatedMoviesResponse | null = null;

  genres: Genre[] = [];

  constructor(private sessionService: SessionService, private supabaseService: SupabaseService) {
  }

  async fetchTopRatedMovies(page: number = 1): Promise<RatedMoviesResponse> {
    const response = await fetch(`${this.tmdbUrl}/movie/top_rated?api_key=${this.tmdbKey}&page=${page}`);
    return this.ratedMoviesResponse = await response.json();
  }

  async fetchMovieGenres(): Promise<Genre[]> {
    const response = await fetch(`${this.tmdbUrl}/genre/movie/list?language=en&api_key=${this.tmdbKey}`);
    const data = await response.json();
    this.genres = data.genres;
    return this.genres;
  }

  async fetchMoviesByGenres(genreId: number): Promise<RatedMoviesResponse> {
    const response = await fetch(`${this.tmdbUrl}/discover/movie?api_key=${this.tmdbKey}&with_genres=${genreId}&page=${1}`);
    return this.ratedMoviesResponse = await response.json();
  }

  async fetchMovieById(movieId: number): Promise<RatedMovie> {
    const response = await fetch(`${this.tmdbUrl}/movie/${movieId}?api_key=${this.tmdbKey}`);
    const movie = await response.json();
    return movie;
  }

  async fetchMoviesByIdArray(movieIds: number[]): Promise<RatedMovie[]> {
    const movies = await Promise.all(
      movieIds.map(id =>
        fetch(`${this.tmdbUrl}/movie/${id}?api_key=${this.tmdbKey}`)
          .then(res => res.json())
      )
    );

    return movies;
  }

  getImgBaseUrl(): string{
    return this.imgBaseUrl
  }

  async toggleLike(movieId: number, interaction: Interaction): Promise<Interaction | null>{
    const userId = this.sessionService.getSession()?.id;

    if (!userId || !movieId) return null;

    // se nao existir nenhuma interacao, cria nova
    if (!interaction) {
      const newInteraction: Interaction = {
        userId,
        movieId,
        isLiked: true,
        isFavorite: false,
        isWatchLater: false
      };
      const success = await this.supabaseService.insertMovieInteraction(newInteraction);
      if (success) interaction = newInteraction;
      return interaction;
    }

    // atualiza interacao existente
    interaction.isLiked = !interaction.isLiked;
    await this.supabaseService.updateMovieInteraction(interaction);
    return interaction;
  }
  
  async toggleFavorite(movieId: number, interaction: Interaction): Promise<Interaction | null> {
    const userId = this.sessionService.getSession()?.id;

    if (!userId || !movieId) return null;

    // se nao existir nenhuma interacao, cria nova
    if (!interaction) {
      const newInteraction: Interaction = {
        userId,
        movieId,
        isLiked: false,
        isFavorite: true,
        isWatchLater: false
      };
      const response = await this.supabaseService.insertMovieInteraction(newInteraction);
      if (response) interaction = newInteraction;
      return interaction;
    }
    // atualiza interacao existente
    interaction.isFavorite = !interaction.isFavorite;
    await this.supabaseService.updateMovieInteraction(interaction);
    return interaction;
  }
  
  async toggleWatchLater(movieId: number, interaction: Interaction): Promise<Interaction | null> {
    const userId = this.sessionService.getSession()?.id;

    if (!userId || !movieId) return null;

    // se nao existir nenhuma interacao, cria nova
    if (!interaction) {
      const newInteraction: Interaction = {
        userId,
        movieId,
        isLiked: false,
        isFavorite: false,
        isWatchLater: true
      };
      const success = await this.supabaseService.insertMovieInteraction(newInteraction);
      if (success) interaction = newInteraction;
      return interaction;
    }
    // atualiza interacao existente
    interaction.isWatchLater = !interaction.isWatchLater;
    await this.supabaseService.updateMovieInteraction(interaction);
    return interaction;
  }
  
}


