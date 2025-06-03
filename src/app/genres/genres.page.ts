import { Component, OnInit } from '@angular/core';
import { Genre, RatedmoviesService } from '../services/ratedmovies.service';
import { Session } from '../services/user';
import { Router } from '@angular/router';


@Component({
  selector: 'app-genres',
  templateUrl: './genres.page.html',
  styleUrls: ['./genres.page.scss'],
  standalone: false
})
export class GenresPage implements OnInit {

  session: Session | null = null;
  genres: Genre[] = [];

  constructor(private ratedMoviesService: RatedmoviesService, private router: Router) { }

  async ngOnInit() {
    this.genres = await this.ratedMoviesService.fetchMovieGenres();
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

}
