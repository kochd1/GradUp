import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InformationDocumentationPage } from '../information-documentation/information-documentation';

@IonicPage()
@Component({
  selector: 'page-information-psyche',
  templateUrl: 'information-psyche.html',
})
export class InformationPsychePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InformationPsychePage');
  }

  public gotoInformationPage() {
    //this.navCtrl.push(InformationPage, {});
    this.navCtrl.popToRoot();
  }

}
