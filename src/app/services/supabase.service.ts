import { Injectable } from '@angular/core';
import {createClient, SupabaseClient } from '@supabase/supabase-js';
import { User } from './user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  private supabaseUrl = environment.supabaseUrl;
  private supabaseKey = environment.supabaseKey;
  private supabaseClient: SupabaseClient;

  constructor() {
    this.supabaseClient = createClient(this.supabaseUrl, this.supabaseKey);
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
      .single();

    if(error) throw error;

    return data as User;
  }

  async insertUser(user: User){
    const{ data, error } = await this.supabaseClient
    .from('users')
    .insert(user)
    .single();

    if(error) return null;

    return data;
  }

}
