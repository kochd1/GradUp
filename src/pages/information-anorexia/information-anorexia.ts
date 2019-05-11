import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser'
import { InformationDocumentationPage } from '../information-documentation/information-documentation';
import { PopoverComponent } from '../../components/popover/popover';

@IonicPage()
@Component({
  selector: 'page-information-anorexia',
  templateUrl: 'information-anorexia.html',
})
export class InformationAnorexiaPage {

  url1: string;
  url2: string;
  url3: string;
  url4: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public popoverCtrl: PopoverController,
    private inAppBrowser: InAppBrowser) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InformationAnorexiaPage');
  }

  presentPopover(myEvent) {
    let myPopoverData = {
      infoText: "Untenstehend wurden Leitlinien - Empfehlungen resp. Behandlungsempfehlungen - seitens der AWMF (Arbeitsgemeinschaft für medizinische Fachgesellschaften) verlinkt." +

        "Die Patientenleitlinie vermittelt vereinfachtes Wissen über die Krankheit und die Behandlungsmethoden und bietet dir einen guten Überblick. Die Behandlungsleitlinie S3 ist sehr ausführlich und in erster Linie für Fachpersonen gedacht." +
        " Wenn du aber mehr und detaillierteres erfahren willst, kannst du dort nachschauen. Weiter findest du Links zu schweizerischen Fachstellen, über welche du dich zusätzlich informieren kannst."

    }
    let popover = this.popoverCtrl.create(PopoverComponent, { data: myPopoverData });
    popover.present({
      ev: myEvent
    });
  }

  public async openInformationPopover() {
    /*const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();*/
  }

  public openWebPage(url: string) {
    const options: InAppBrowserOptions = {

    }
    //opening a URL and returning an InAppBrowserObject
    this.inAppBrowser.create(url, '_self'); //options -> not required

    //const browser...
  }

  public gotoInformationPage() {
    //this.navCtrl.push(InformationPage, {});
    this.navCtrl.popToRoot();
  }

}
