import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MorePage } from '../more/more';

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

  public gotoMorePage() {
    //this.navCtrl.push(AdaptionsPage, {});
    this.navCtrl.popToRoot();
  }

}
