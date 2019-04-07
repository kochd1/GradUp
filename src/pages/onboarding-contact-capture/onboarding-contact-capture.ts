import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WelcomeConnectPage } from '../welcome-connect/welcome-connect';
import { WelcomeContact2Page } from '../welcome-contact2/welcome-contact2';

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

  public gotoWelcomeContact2Page() {
    this.navCtrl.push(WelcomeContact2Page, {});
  }

}
