import { Component, Input, OnInit } from '@angular/core';
import { RatedMovie, Review } from '../../services/ratedmovies.service';
import { Interaction, SupabaseService } from '../../services/supabase.service';
import { SessionService } from '../../services/session.service';
import { RatedmoviesService } from '../../services/ratedmovies.service';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ReviewModalComponent } from '../review-modal/review-modal.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class MovieCardComponent implements OnInit {
  @Input() movie?: RatedMovie | null;
  @Input() showDetails: boolean = true;
  @Input() showMeta: boolean = true;
  @Input() showReviews: boolean = true;
  @Input() onClickRedirectToMovieInfo: boolean = true;
  @Input() isLoading: boolean = true;
  @Input() isLoadingReviews: boolean = false;


  interaction: Interaction | null = null;
  imgBaseUrl: string;
  movieReviews: Review[] | null = null;
  userReview: Review | null = null;

  constructor(
    private sessionService: SessionService,
    private supabaseService: SupabaseService,
    private ratedMoviesService: RatedmoviesService,
    private router: Router,
    private modalController: ModalController,
    private toastController: ToastController
  ) {
    this.imgBaseUrl = this.ratedMoviesService.getImgBaseUrl();
  }

  async ngOnInit() {
    const redirected = await this.sessionService.redirectIfNoSession()
    if(redirected) return;

    const userId = this.sessionService.getSession()?.id;
    if (userId && this.movie?.id) {
      this.interaction = await this.supabaseService.getMovieInteraction(userId, this.movie.id);
    }
    
    if(this.showReviews){
      await this.loadReviews(userId!)
    }
    this.isLoading = false;
    this.isLoadingReviews = false;
  }

  async loadInteraction(userId: string, movieId: number){
    this.interaction = await this.supabaseService.getMovieInteraction(userId, movieId);
    console.log(this.interaction);
  }

  async toggleLike(movieId: number) {
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
  }

  goToMovieInfo(movieId: number | null){
    if (!this.onClickRedirectToMovieInfo) return;
    if(movieId){
      this.router.navigateByUrl(`/movieinfo/${movieId}`);
    }
  }

  async loadReviews(userId: string){
      this.movieReviews = await this.supabaseService.getReviewsByMovieId(this.movie!.id);
      this.userReview = await this.supabaseService.getMovieReviewByUserId(userId!, this.movie!.id)
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: ReviewModalComponent
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      console.log('User review submitted:', data);
      // Optionally save it to backend
    }
  }

  async openReviewModal() {
    const modal = await this.modalController.create({
      component: ReviewModalComponent,
      componentProps: {
        movieId: this.movie?.id
      }
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();

    if (role === 'confirm' && data) {
      
      
      this.isLoadingReviews = true;
      await this.supabaseService.insertMovieReview(data);
      // carregar reviews
      const userId = this.sessionService.getSession()?.id;
      this.loadReviews(userId!);

      await this.showToast('Review submitted successfully!');
      this.isLoadingReviews = false;
    }
  }

  async deleteReview() {
    if (!this.userReview?.id || this.userReview.id.length === 0) return;

    const confirmed = confirm('Are you sure you want to delete your review?');
    if (!confirmed) return;

    const success = await this.supabaseService.removeMovieReviewById(this.userReview.id);

    if (success) {
      const userId = this.sessionService.getSession()?.id;
      this.isLoadingReviews = true
      if (userId) {
        await this.loadReviews(userId);
      }
      this.isLoadingReviews = false
      await this.showToast('Your review has been deleted');
    } else {
      await this.showToast('Something went wrong while deleting your review');
    }
  }

  async showToast(message: string) {
  const toast = await this.toastController.create({
    message,
    duration: 3000,
    position: 'bottom',
    color: 'medium'
  });

  await toast.present();
}
}
