import { Component, OnInit } from '@angular/core';
import { Genre, RatedMovie, RatedmoviesService } from '../services/ratedmovies.service';
import { SessionService } from '../services/session.service';
import { IonContent } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
  standalone: false
})
export class DiscoverPage implements OnInit {

  @ViewChild('contentRef', { static: false })content!: IonContent; //para o scroll para o topo

  movies: RatedMovie[] = [];
  genres: Genre[] = [];
  page: number = 1;
  imgBaseUrl: string | null = null;
  selectedGenreId: number | null = null;

  byParamGenreId: number | null = null;

  isSearch: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ratedMoviesService: RatedmoviesService,
    private sessionService: SessionService)
  {
    this.imgBaseUrl = this.ratedMoviesService.getImgBaseUrl();
  }

  async ngOnInit() {}

  async ionViewWillEnter() {
    const redirected = await this.sessionService.redirectIfNoSession()
    if(redirected) return;

    const param = this.route.snapshot.paramMap.get('genreId');

    if (!param) {
      await this.loadMovies();
      this.selectedGenreId = null;
    } 
    else if (param === 'suggestions') {
      this.movies = this.ratedMoviesService.suggestions;
      this.selectedGenreId = 9999999;
    } else {
      this.byParamGenreId = Number(param);
      
      if (isNaN(this.byParamGenreId)) {
        await this.loadMovies();
      } else {
        this.selectedGenreId = this.byParamGenreId;
        await this.filterByGenre(this.byParamGenreId);
      }
    }
    this.genres = await this.ratedMoviesService.fetchMovieGenres();
  }

  async ionViewWillLeave() { this.isSearch = false; }

  async loadMovies() {
    this.movies = [];
    this.selectedGenreId = null;
    const data = await this.ratedMoviesService.fetchTopRatedMovies(this.page);
    this.movies = data.results;

    setTimeout(() => {
      this.content?.scrollToTop(300);
    }, 100);
  }

  async loadMore(event: any) {
    this.page++;
    await this.loadMovies();
    event.target.complete();
  }

  async filterByGenre(genreId: number | null) {
    if(genreId === null){
      this.loadMovies();
      return;
    }
    this.page = 1;
    this.movies = [];
    this.selectedGenreId = genreId;
    const data = await this.ratedMoviesService.fetchMoviesByGenres(genreId!);
    this.movies = data!.results ?? [];

    setTimeout(() => {
      this.content?.scrollToTop(300);
    }, 100);
  }

  goToMovieInfo(movieId: number | null){
    if(movieId){
      this.router.navigateByUrl(`/movieinfo/${movieId}`);
    }
  }

}
