import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WelcomeAppexplanationPage } from '../welcome-appexplanation/welcome-appexplanation';
import { OnboardingProfileCapturePage } from '../onboarding-profile-capture/onboarding-profile-capture';
import { OnboardingBiovotionPage } from '../onboarding-biovotion/onboarding-biovotion';
import { TabsPage } from '../tabs/tabs';
import { OnboardingContactCapturePage } from '../onboarding-contact-capture/onboarding-contact-capture';

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
  }

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

  public gotoOnboardingContactCapturePage() {
    this.navCtrl.push(OnboardingContactCapturePage, {});
  }

  public gotoOnboardingBiovotionPage() {
    this.navCtrl.push(OnboardingBiovotionPage, {});
  }

  public gotoTabsPage() {
    this.navCtrl.push(TabsPage, {});
  }
}
