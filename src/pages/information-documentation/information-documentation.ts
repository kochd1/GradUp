import { Component } from '@angular/core';
import { PopoverComponent } from '../../components/popover/popover';

import { IonicPage, NavController, PopoverController } from 'ionic-angular';
import { InformationAnorexiaPage } from '../information-anorexia/information-anorexia';
import { DocumentationFearsDelightsPage } from '../documentation-fears-delights/documentation-fears-delights';
import { DocumentationViewsBeliefsPage } from '../documentation-views-beliefs/documentation-views-beliefs';
import { DocumentationFurtherThoughtsPage } from '../documentation-further-thoughts/documentation-further-thoughts';
import { DocumentationSetbackSuccessPage } from '../documentation-setback-success/documentation-setback-success';


@IonicPage()
@Component({
  selector: 'page-information-documentation',
  templateUrl: 'information-documentation.html',
})
export class InformationDocumentationPage {

  constructor(
    public navCtrl: NavController,
    public popoverCtrl: PopoverController
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InformationDocumentationPage');
  }

  presentPopover(myEvent) {
    let myPopoverData = {
      infoText: "Information: Hier erhälst du Informationen über die Krankheit Anorexia nervosa (Magersucht) sowie über deren Behandlung." +
        " Dokumentation: Hier kannst du deine Ängste/Freuden, Ansichten/Überzeugungen, persönliche Rückschläge/Erfolge sowie auch weitere Gedanken erfassen. Du kannst die Einträge jederzeit bearbeiten und löschen."
    }
    let popover = this.popoverCtrl.create(PopoverComponent, { data: myPopoverData });
    popover.present({
      ev: myEvent
    });
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
