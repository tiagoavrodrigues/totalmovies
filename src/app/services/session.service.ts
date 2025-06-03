import { Injectable } from '@angular/core';
import { Storage }from '@ionic/storage-angular'
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { Session } from './user';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  session: Session | null = null;

  constructor(private storage: Storage) {
  }

  async loadSession(){
    await this.storage.defineDriver(CordovaSQLiteDriver);
    await this.storage.create();
    const session = await this.storage.get('session') as Session;
    if(session){
      this.session = session;
    }
    console.log('sessionId: ' + this.session?.id);
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
    return !!this.session?.email;
  }
}
