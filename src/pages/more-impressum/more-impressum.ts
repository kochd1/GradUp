import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AdaptionsPage } from '../adaptions/adaptions';

@IonicPage()
@Component({
  selector: 'page-more-impressum',
  templateUrl: 'more-impressum.html',
})
export class MoreImpressumPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MoreImpressumPage');
  }

  public gotoAdaptionsPage() {
    //this.navCtrl.push(AdaptionsPage, {});
    this.navCtrl.popToRoot();
  }

}
