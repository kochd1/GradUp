import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AdaptionsPage } from '../adaptions/adaptions';

@IonicPage()
@Component({
  selector: 'page-profile-privacy',
  templateUrl: 'profile-privacy.html',
})
export class ProfilePrivacyPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePrivacyPage');
  }

  public gotoAdaptionsPage() {
    this.navCtrl.push(AdaptionsPage, {});
  }

}
