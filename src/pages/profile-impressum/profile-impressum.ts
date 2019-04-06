import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AdaptionsPage } from '../adaptions/adaptions';

@IonicPage()
@Component({
  selector: 'page-profile-impressum',
  templateUrl: 'profile-impressum.html',
})
export class ProfileImpressumPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileImpressumPage');
  }

  public gotoAdaptionsPage() {
    this.navCtrl.push(AdaptionsPage, {});
  }

}
