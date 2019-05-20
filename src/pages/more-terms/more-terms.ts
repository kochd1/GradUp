import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser'

//component
import { PopoverComponent } from '../../components/popover/popover';

@IonicPage()
@Component({
  selector: 'page-more-terms',
  templateUrl: 'more-terms.html',
})
export class MoreTermsPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private popoverCtrl: PopoverController,
    private inAppBrowser: InAppBrowser) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MoreTermsPage');
  }

  presentPopover(myEvent) {
    let myPopoverData = {
      infoText: "Auf dieser Seite sind zum einen die Allgemeinen Geschäftsbedingungen (Nutzungsbedingungen) von MIDATA verlinkt. Weiter sind die Nutzungsbedingungen von GradUp einsehbar."
    }
    let popover = this.popoverCtrl.create(PopoverComponent, { data: myPopoverData });
    popover.present({
      ev: myEvent
    });
  }

  public openWebPage(url: string) {
    const options: InAppBrowserOptions = {

    }
    //opening a URL and returning an InAppBrowserObject
    this.inAppBrowser.create(url, '_self'); //options -> not required

    //const browser...
  }

  public gotoMorePage() {
    //this.navCtrl.push(AdaptionsPage, {});
    this.navCtrl.popToRoot();
  }

}
