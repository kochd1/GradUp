import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalGoalsPage } from './modal-goals';

@NgModule({
  declarations: [
    ModalGoalsPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalGoalsPage),
  ],
})
export class ModalGoalsPageModule {}
