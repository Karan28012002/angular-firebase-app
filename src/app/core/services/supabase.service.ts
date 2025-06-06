import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    if (!environment.supabaseUrl || !environment.supabaseKey) {
      console.error('Supabase URL or Key is not defined in the environment variables.');
      // Consider throwing an error or handling this more robustly in a production app
    }
    // Initialize the Supabase client
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
} 