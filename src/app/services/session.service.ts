import { Injectable } from '@angular/core';
import { Storage }from '@ionic/storage-angular'
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { Session, User } from './user';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private session: Session | null = null;
  private user: User | null = null;

  constructor(private storage: Storage, private router: Router, private supabaseService: SupabaseService) {
  }

  redirectIfNoSession(): boolean{
    if(!this.hasSession()){
      this.router.navigateByUrl('/signin');
      return true;
    }
    return false;
  }

  async initStorage(){
    await this.storage.defineDriver(CordovaSQLiteDriver);
    await this.storage.create();
  }

  async loadSession(){
    const session = await this.storage.get('session') as Session;
    if(session){
      this.session = session;
    }
  }

async createSession(session: Session) {
    await this.storage.set('session', session);
    const savedSession = await this.storage.get('session');
    console.log('Session Created and Saved:', savedSession);
    this.session = savedSession;
    console.log('Session after save:', await this.storage.get('session'));
}

  async deleteSession(){
    await this.storage.remove('session');
    this.session = null;
  }

  getSession(){
    return this.session;
  }

  hasSession(): boolean {
    return !!(this.session && this.session.email);
  }

  async authenticate(email: string, password: string): Promise<Session | null> {
    const data =  await this.supabaseService.getUserByEmail(email);
    if (!data) return null;

    if(data.password !== password) return null;
    return data as Session;
  }
}
