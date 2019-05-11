import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser'
import { SupportPage } from "../support/support";
import { PopoverComponent } from '../../components/popover/popover';

@IonicPage()
@Component({
  selector: 'page-support-self-help-propositions',
  templateUrl: 'support-self-help-propositions.html',
})
export class SupportSelfHelpPropositionsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController, private inAppBrowser: InAppBrowser) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SupportSelfHelpPropositionsPage');
  }

  presentPopover(myEvent) {
    let myPopoverData = {
      infoText: "Untenstehend sind für dich Links zu Selbsthilfegruppen und Selbsthilfechats aufgelistet."

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

  public gotoSupportPage() {
    //this.navCtrl.push(HelpPage, {});
    this.navCtrl.popToRoot();
  }

}
