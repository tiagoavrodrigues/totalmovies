import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { Review } from '../../services/ratedmovies.service';
import { IonHeader } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionService } from 'src/app/services/session.service';
import { Session } from 'src/app/services/user';

@Component({
  selector: 'app-review-modal',
  templateUrl: './review-modal.component.html',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
})
export class ReviewModalComponent {
  @Input() movieId!: number;

  review: Review = {
    userId: '',
    movieId: 0,
    rating: 0,
    name: '',
    review: ''
  };

  rating: number = 0;
  reviewText: string = '';

  user: Session | null = null;

  constructor(private modalController: ModalController, private sessionService: SessionService) {}

  ngOnInit() {this.user = this.sessionService.getSession();}

  setRating(rating: number) {
    if(rating === 0) rating = 1;
    this.review.rating = rating;
  }

  submit() {
    this.submitReview();
    this.modalController.dismiss(this.review);
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async submitReview() {
    const newReview: Review = {
      userId: this.user?.id!,       
      movieId: this.movieId!,     // componentProps
      rating: this.review.rating,        // form
      name: this.user!.name,       
      review: this.review.review     // form
    };
    await this.modalController.dismiss(newReview, 'confirm');
  }

}