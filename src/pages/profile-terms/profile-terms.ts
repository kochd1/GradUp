import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AdaptionsPage } from '../adaptions/adaptions';

@IonicPage()
@Component({
  selector: 'page-profile-terms',
  templateUrl: 'profile-terms.html',
})
export class ProfileTermsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileTermsPage');
  }

  public gotoAdaptionsPage() {
    //this.navCtrl.push(AdaptionsPage, {});
    this.navCtrl.popToRoot();
  }

}
