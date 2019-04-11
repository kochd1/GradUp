import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InformationDocumentationPage } from '../information-documentation/information-documentation';

@IonicPage()
@Component({
  selector: 'page-documentation-fears-delights',
  templateUrl: 'documentation-fears-delights.html',
})
export class DocumentationFearsDelightsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DocumentationFearsDelightsPage');
  }

  public gotoInformationPage() {
    //this.navCtrl.push(InformationPage, {});
    this.navCtrl.popToRoot();
  }

}
