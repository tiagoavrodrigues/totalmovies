import { Component, OnInit } from '@angular/core';
import { Genre, RatedmoviesService } from '../services/ratedmovies.service';
import { Session } from '../services/user';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { MenuController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.page.html',
  styleUrls: ['./genres.page.scss'],
  standalone: false
})
export class GenresPage implements OnInit {

  session: Session | null = null;
  genres: Genre[] = [];

  searchQuery: string = '';

  constructor(
    public ratedMoviesService: RatedmoviesService,
    private router: Router,
    private sessionService: SessionService,
    private menuController: MenuController,
    private sideMenu : AppComponent
    ) { }

  async ngOnInit() {

  }

  async ionViewWillEnter(){
    const redirected = await this.sessionService.redirectIfNoSession()
    if(redirected) return;
    await StatusBar.hide();
    this.searchQuery = '';
    this.ratedMoviesService.suggestions = [];
    this.sideMenu.userInfo = this.sessionService.getSession();

    this.session = this.sessionService.getSession();
    this.genres = await this.ratedMoviesService.fetchMovieGenres();
    await this.menuController.enable(true);
  }

  formatGenreImageName(name: string): string {
    return 'assets/images/genres/' + name.toLowerCase().replace(/\s+/g, '') + '.jpg';
  }

  goToGenre(genreId: number | null) {
    if (genreId != null) {
      this.router.navigateByUrl(`/discover/${genreId}`);
    } else {
      this.router.navigateByUrl('/discover');
    }
  }

  async onSearch(event: any) {
    const query = event.target.value;
    if (query.length > 2) {
      this.ratedMoviesService.suggestions = await this.ratedMoviesService.fetchMoviesByQuery(query);
    } else {
      this.ratedMoviesService.suggestions = [];
    }
  }

  goToMovieInfo(movieId: number | null){
    if (movieId === null) console.log('huehueheu');
    if(movieId){
      this.router.navigateByUrl(`/movieinfo/${movieId}`);
    }
  }

  displaySuggestions(){
    if(this.ratedMoviesService.suggestions.length === 0) return;
    this.router.navigateByUrl(`/discover/suggestions`);
  }

}
