import { Injectable } from '@angular/core';
import {createClient, SupabaseClient } from '@supabase/supabase-js';
import { Session, User } from './user';
import { environment } from '../../environments/environment';
import { RatedMovie, Review } from './ratedmovies.service';

export interface Interaction{
  id?: string,
  userId: string,
  movieId: number,
  isLiked: boolean,
  isFavorite: boolean,
  isWatchLater: boolean
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  

  private supabaseUrl = environment.supabaseUrl;
  private supabaseKey = environment.supabaseKey;
  private supabaseClient: SupabaseClient;

  constructor() {
    //this.supabaseClient = createClient(this.supabaseUrl, this.supabaseKey);
    this.supabaseClient = createClient(environment.supabaseUrl, environment.supabaseKey, {
      global: {
        headers: {
          'Accept': 'application/json', //
        },
      },
    });

  }

  async getUsers(): Promise<User[]> {
    const { data, error } = await this.supabaseClient
      .from('users')
      .select('*')
      .order('email', { ascending: true });

    if(error) return [];

    return data as User[];
  }

  async getUserByEmail(email: string): Promise<User>{
    const { data, error } = await this.supabaseClient
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if(error) throw error;
    return data as User;
  }

  async insertUser(user: User){
    const{ data, error } = await this.supabaseClient
    .from('users')
    .insert(user)
    .maybeSingle();

    if(error) return null;
    return data;
  }


  async getMovieInteraction(userId: string, movieId: number): Promise<Interaction | null>{
      const { data, error } = await this.supabaseClient
      .from('userMovieInteraction')
      .select('*')
      .eq('userId', userId)
      .eq('movieId', movieId)
      .maybeSingle();

    if(error) return null;
    return data as Interaction;
  }

  async getMovieInteractions(): Promise<Interaction[] | null>{
    const { data, error } = await this.supabaseClient
      .from('userMovieInteraction')
      .select('*');
    if(error) return [];
    return data as Interaction[];
  }

  async getMovieInteractionsByUserId(userId: string): Promise<Interaction[] | null>{
    const { data, error } = await this.supabaseClient
      .from('userMovieInteraction')
      .select('*')
      .eq('userId', userId);

    if(error) return null;
    return data as Interaction[];
  }

  async insertMovieInteraction(newInteraction: Interaction): Promise<boolean>{
    const response = await this.getMovieInteraction(newInteraction.userId, newInteraction.movieId)
    if(response !== null){
      return false;
    }
    const { data, error } = await this.supabaseClient
      .from('userMovieInteraction')
      .insert({
        userId: newInteraction.userId,
        movieId: newInteraction.movieId,
        isLiked: newInteraction.isLiked,
        isFavorite: newInteraction.isFavorite,
        isWatchLater: newInteraction.isWatchLater
      });
    if(error){
      console.log(newInteraction);
      return false;
    }
    return true;
  }

  async updateMovieInteraction(newInteraction: Interaction): Promise<boolean>{
    const { data, error } = await this.supabaseClient
      .from('userMovieInteraction')
      .update({
        isLiked: newInteraction.isLiked,
        isFavorite: newInteraction.isFavorite,
        isWatchLater: newInteraction.isWatchLater
      })
    .eq('id', newInteraction.id);

    if (error) return false;
    return true;
  };

  async getReviewsByMovieId(movieId: number): Promise<Review[] | null>{
    const{ data, error } = await this.supabaseClient
      .from('userMovieReview')
      .select('*')
      .eq('movieId', movieId);

    if(error) return null;

    return data as Review[];
  }

  async getMovieReviewByUserId(userId: string, movieId: number): Promise<Review | null>{
    const{ data, error } = await this.supabaseClient
      .from('userMovieReview')
      .select('*')
      .eq('userId', userId)
      .eq('movieId', movieId)
      .maybeSingle();
    if(error) return null;

    return data as Review;
  }

  async insertMovieReview(newReview: Review){
    await this.supabaseClient
      .from('userMovieReview')
      .insert(newReview);
  }

  async updateMovieReviewById(newReview: Review): Promise<boolean>{
    const{ data, error } = await this.supabaseClient
      .from('userMovieReview')
      .update({
        rating: newReview.rating,
        review: newReview.review
      })
      .eq('Id', newReview.id);
    if(error) return false;

    return true;
  }

  async removeMovieReviewById(reviewId: string): Promise<boolean>{
    const{ data, error}= await this.supabaseClient
      .from('userMovieReview')
      .delete()
      .eq('id', reviewId);

    if(error) return false;
    return true;
  }
}
