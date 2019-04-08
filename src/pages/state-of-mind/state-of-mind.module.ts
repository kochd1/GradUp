import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StateOfMindPage } from './state-of-mind';

@NgModule({
  declarations: [
    StateOfMindPage,
  ],
  imports: [
    IonicPageModule.forChild(StateOfMindPage),
  ],
})
export class StateOfMindPageModule {}
