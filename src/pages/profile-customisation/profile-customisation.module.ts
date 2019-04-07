import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileCustomisationPage } from './profile-customisation';

@NgModule({
  declarations: [
    ProfileCustomisationPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileCustomisationPage),
  ],
})
export class ProfileCustomizePageModule {}
