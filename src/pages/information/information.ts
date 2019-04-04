import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { InformationAnorexiaPage } from '../information-anorexia/information-anorexia';
import { InformationPsychePage } from '../information-psyche/information-psyche';


@IonicPage()
@Component({
  selector: 'page-information',
  templateUrl: 'information.html',
})
export class InformationPage {

  constructor(
    public navCtrl: NavController
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad InformationPage');
  }

  public gotoInformationAnorexiaPage() {
    this.navCtrl.push(InformationAnorexiaPage, {});
  }

  public gotoInformationPsychePage() {
    this.navCtrl.push(InformationPsychePage, {});
  }

}
