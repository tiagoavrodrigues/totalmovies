import { Component } from '@angular/core';
import { SessionService } from './services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  public appPages = [
    { title: 'Genres', url: '/genres', icon: 'film' },
    { title: 'Discover', url: '/discover', icon: 'compass' },
    { title: 'Liked', url: '/lists/liked', icon: 'heart' },
    { title: 'Favorites', url: '/lists/favorites', icon: 'star' },
    { title: 'Watch Later', url: '/lists/watchlater', icon: 'time' },
  ];
  public labels = [];
  constructor(private sessionService: SessionService, private router: Router) {}

  async signOut() {
    await this.sessionService.deleteSession();
    this.router.navigateByUrl('/signin');
  }
}