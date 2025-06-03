import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MovieinfoPageRoutingModule } from './movieinfo-routing.module';

import { MovieinfoPage } from './movieinfo.page';
import { MovieCardComponent } from '../components/movie-card/movie-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MovieinfoPageRoutingModule,
    MovieCardComponent
  ],
  declarations: [MovieinfoPage]
})
export class MovieinfoPageModule {}
