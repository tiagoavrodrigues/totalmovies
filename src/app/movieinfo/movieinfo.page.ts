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
    private sessionService: SessionService,
    private supabaseService: SupabaseService)
  {}

  async ngOnInit() {
    if(this.sessionService.getSession() === null){
      console.log(this.sessionService.getSession()?.id);
      this.router.navigateByUrl('/signin');
      return;
    }
    this.byParamMovieId = Number(this.route.snapshot.paramMap.get('movieId'));
    if(this.byParamMovieId === null){
      this.router.navigateByUrl('/genres');
    }else{
      this.movie = await this.ratedMovieService.fetchMovieById(this.byParamMovieId);
    }
    this.imgBaseUrl = this.ratedMovieService.getImgBaseUrl();
    this.loading = false;
  }

/*   async loadInteraction(userId: string, movieId: number){
    this.interaction = await this.supabaseService.getMovieInteraction(userId, movieId);
  } */

/*   async toggleLike(movieId: number) {
    const userId = this.sessionService.getSession()?.id;

    if (!userId || !movieId) return;

    // se nao existir nenhuma interacao, cria nova
    if (!this.interaction) {
      const newInteraction: Interaction = {
        userId,
        movieId,
        isLiked: true,
        isFavorite: false,
        isWatchLater: false
      };
      const success = await this.supabaseService.insertMovieInteraction(newInteraction);
      if (success) this.interaction = newInteraction;
      return;
    }

    // atualiza interacao existente
    this.interaction.isLiked = !this.interaction.isLiked;
    await this.supabaseService.updateMovieInteraction(this.interaction);
  }

  async toggleFavorite(movieId: number) {
    const userId = this.sessionService.getSession()?.id;

    if (!userId || !movieId) return;

    // se nao existir nenhuma interacao, cria nova
    if (!this.interaction) {
      const newInteraction: Interaction = {
        userId,
        movieId,
        isLiked: false,
        isFavorite: true,
        isWatchLater: false
      };
      const response = await this.supabaseService.insertMovieInteraction(newInteraction);
      if (response) this.interaction = newInteraction;
      return;
    }
    // atualiza interacao existente
    this.interaction.isFavorite = !this.interaction.isFavorite;
    await this.supabaseService.updateMovieInteraction(this.interaction);
  }

  async toggleWatchLater(movieId: number) {
    const userId = this.sessionService.getSession()?.id;

    if (!userId || !movieId) return;

    // se nao existir nenhuma interacao, cria nova
    if (!this.interaction) {
      const newInteraction: Interaction = {
        userId,
        movieId,
        isLiked: false,
        isFavorite: false,
        isWatchLater: true
      };
      const success = await this.supabaseService.insertMovieInteraction(newInteraction);
      if (success) this.interaction = newInteraction;
      return;
    }
    // atualiza interacao existente
    this.interaction.isWatchLater = !this.interaction.isWatchLater;
    await this.supabaseService.updateMovieInteraction(this.interaction);
  } */

}
