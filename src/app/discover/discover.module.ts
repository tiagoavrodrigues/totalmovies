import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiscoverPageRoutingModule } from './discover-routing.module';

import { DiscoverPage } from './discover.page';
import { MovieCardComponent } from '../components/movie-card/movie-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiscoverPageRoutingModule,
    MovieCardComponent
  ],
  declarations: [DiscoverPage]
})
export class DiscoverPageModule {}
