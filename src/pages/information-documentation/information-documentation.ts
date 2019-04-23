import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { InformationAnorexiaPage } from '../information-anorexia/information-anorexia';
import { DocumentationFearsDelightsPage } from '../documentation-fears-delights/documentation-fears-delights';
import { DocumentationViewsBeliefsPage } from '../documentation-views-beliefs/documentation-views-beliefs';
import { DocumentationFurtherThoughtsPage } from '../documentation-further-thoughts/documentation-further-thoughts';
import { DocumentationSetbackSuccessPage} from '../documentation-setback-success/documentation-setback-success';


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

  public gotoDocumentationSetbackSuccessPage() {
    this.navCtrl.push(DocumentationSetbackSuccessPage, {});
  }

  public gotoDocumentationFurtherThoughtsPage() {
    this.navCtrl.push(DocumentationFurtherThoughtsPage, {});
  }

}
