import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WelcomeConnectPage } from '../welcome-connect/welcome-connect';
import { OnboardingReferencePersonContactCapturePage } from '../onboarding-referenceperson-contact-capture/onboarding-referenceperson-contact-capture';

@IonicPage()
@Component({
  selector: 'page-onboarding-contact-capture',
  templateUrl: 'onboarding-contact-capture.html',
})
export class OnboardingContactCapturePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OnboardingContactCapturePage');
  }

  public gotoWelcomeConnectPage() {
    this.navCtrl.push(WelcomeConnectPage, {});
  }

  public gotoOnboardingReferencePersonContactCapturePage() {
    this.navCtrl.push(OnboardingReferencePersonContactCapturePage, {});
  }

}
