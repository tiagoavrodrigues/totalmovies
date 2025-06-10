import { Component } from '@angular/core';
import { SessionService } from './services/session.service';
import { Router } from '@angular/router';
import { Session } from './services/user';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent{

  public userInfo : Session | null = this.sessionService.getSession();

  public appPages = [
    { title: 'Genres', url: '/genres', icon: 'film' },
    { title: 'Discover', url: '/discover', icon: 'compass' },
    { title: 'Liked', url: '/lists/liked', icon: 'heart' },
    { title: 'Favorites', url: '/lists/favorites', icon: 'star' },
    { title: 'Watch Later', url: '/lists/watchlater', icon: 'time' },
  ];
  public labels = [];
  constructor(private sessionService: SessionService, private router: Router, private loadingController: LoadingController) {}

  async ngOnInit() { }

  async signOut() {
    const loading = await this.loadingController.create({
      message: 'Signing out...',
      spinner: 'lines'
    });
    loading.present();

    await this.sessionService.deleteSession();
    loading.dismiss();
    this.router.navigateByUrl('/signin', { replaceUrl: true });
  }
}