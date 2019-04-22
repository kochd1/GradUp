import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { InformationAnorexiaPage } from '../information-anorexia/information-anorexia';
import { DocumentationFearsDelightsPage } from '../documentation-fears-delights/documentation-fears-delights';
import { DocumentationViewsBeliefsPage } from '../documentation-views-beliefs/documentation-views-beliefs';


@IonicPage()
@Component({
  selector: 'page-information-documentation',
  templateUrl: 'information-documentation.html',
})
export class InformationDocumentationPage {

  constructor(
    public navCtrl: NavController
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad InformationDocumentationPage');
  }

  public gotoInformationAnorexiaPage() {
    this.navCtrl.push(InformationAnorexiaPage, {});
  }

  public gotoDocumentationFearsDelightsPage() {
    this.navCtrl.push(DocumentationFearsDelightsPage, {});
  }

  public gotoDocumentationViewsBeliefsPage() {
    this.navCtrl.push(DocumentationViewsBeliefsPage, {});
  }

}
