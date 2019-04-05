import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, DateTime } from 'ionic-angular';
import { WelcomeAppexplanationPage } from '../welcome-appexplanation/welcome-appexplanation';
import { OnboardingProfileCapturePage } from '../onboarding-profile-capture/onboarding-profile-capture';
import { WelcomeConnectPage } from '../welcome-connect/welcome-connect';
import { TabsPage } from '../tabs/tabs';
import { WelcomeContactPage } from '../welcome-contact/welcome-contact';

@IonicPage()
@Component({
   selector: 'page-welcome',
   templateUrl: 'welcome.html',
})
export class WelcomePage {

   constructor(
      public navCtrl: NavController,
      public navParams: NavParams
   ) { }

   ionViewDidLoad() {
      console.log('ionViewDidLoad WelcomePage');
   }

   public gotoWelcomeAppexplanationPage() {
      this.navCtrl.push(WelcomeAppexplanationPage, {});
   }

   //only necessary for development
   public gotoProfilePage() {
      this.navCtrl.push(OnboardingProfileCapturePage, {});
   }

   public gotoWelcomeContactPage() {
      this.navCtrl.push(WelcomeContactPage, {});
   }

   public gotoWelcomeConnectPage() {
      this.navCtrl.push(WelcomeConnectPage, {});
   }

   public gotoTabsPage() {
      this.navCtrl.push(TabsPage, {});
   }
}