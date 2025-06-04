import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RatedMovie, RatedmoviesService } from '../services/ratedmovies.service';
import { SessionService } from '../services/session.service';
import { Interaction, SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-movieinfo',
  templateUrl: './movieinfo.page.html',
  styleUrls: ['./movieinfo.page.scss'],
  standalone: false
})
export class MovieinfoPage implements OnInit {

  private byParamMovieId: number | null = null;
  movie: RatedMovie | null = null;
  imgBaseUrl: string | null = null;
  interaction: Interaction | null = null;
  loading: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ratedMovieService: RatedmoviesService,
    private sessionService: SessionService,)
  {}

  async ngOnInit() {
  }

  async ionViewWillEnter(){
    const redirected = await this.sessionService.redirectIfNoSession()
    if(redirected) return;

    this.byParamMovieId = Number(this.route.snapshot.paramMap.get('movieId'));
    if(this.byParamMovieId === null){
      this.router.navigateByUrl('/genres');
    }else{
      this.movie = await this.ratedMovieService.fetchMovieById(this.byParamMovieId);
    }
    this.imgBaseUrl = this.ratedMovieService.getImgBaseUrl();
    this.loading = false;
  }
}