import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { RatedMovie, RatedmoviesService } from '../services/ratedmovies.service';
import { SessionService } from '../services/session.service';
import { Interaction, SupabaseService } from '../services/supabase.service';

@Component({
  standalone:false,
  selector: 'app-lists',
  templateUrl: './lists.page.html'
})
export class ListsPage implements OnInit {
  listType: string | null = null;
  isLoading: boolean = true;

  movie: RatedMovie | null = null;
  imgBaseUrl: string | null = null;
  interactions: Interaction[] | null = null;
  movies: RatedMovie[] | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ratedMovieService: RatedmoviesService,
    private sessionService: SessionService,
    private supabaseService: SupabaseService,
    private menu: MenuController,
  ){}

  async ngOnInit() { }

  async ionViewWillEnter() {
    if(this.sessionService.getSession() == null){
      this.router.navigateByUrl('/signin');
    }
    this.listType = this.route.snapshot.paramMap.get('listType');
    await this.loadItems();
    this.imgBaseUrl = this.ratedMovieService.getImgBaseUrl();
    this.menu.enable(true);
  }

  async loadItems(){
    const userId = this.sessionService.getSession()?.id;
    this.interactions = await this.supabaseService.getMovieInteractionsByUserId(userId!);
    this.loadMovies();
    this.isLoading = false;
  }

  async loadMovies() {
    if (!this.interactions) return;

    let movieIds: number[] = [];

    switch (this.listType) {
      case 'liked':
        movieIds = this.interactions.filter(i => i.isLiked).map(i => i.movieId);
        break;
      case 'favorites':
        movieIds = this.interactions.filter(i => i.isFavorite).map(i => i.movieId);
        break;
      case 'watchlater':
        movieIds = this.interactions.filter(i => i.isWatchLater).map(i => i.movieId);
        break;
      default:
        return; // optionally handle unknown listType
    }

    if (movieIds.length > 0) {
      this.movies = await this.ratedMovieService.fetchMoviesByIdArray(movieIds);
    } else {
      this.movies = [];
    }
  }


}