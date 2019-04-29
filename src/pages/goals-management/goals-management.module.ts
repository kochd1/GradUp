import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GoalsManagementPage } from './goals-management';

@NgModule({
  declarations: [
    GoalsManagementPage,
  ],
  imports: [
    IonicPageModule.forChild(GoalsManagementPage),
  ],
})
export class GoalsManagementPageModule {}
