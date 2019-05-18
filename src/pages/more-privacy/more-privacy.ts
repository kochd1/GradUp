import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser'
import { AdaptionsPage } from '../adaptions/adaptions';

//component
import { PopoverComponent } from '../../components/popover/popover';

@IonicPage()
@Component({
  selector: 'page-more-privacy',
  templateUrl: 'more-privacy.html',
})
export class MorePrivacyPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public popoverCtrl: PopoverController,
    private inAppBrowser: InAppBrowser) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MorePrivacyPage');
  }

  presentPopover(myEvent) {
    let myPopoverData = {
      infoText: "Auf dieser Seite ist die Datenschutzerklärung von MIDATA verlinkt."
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

  public gotoAdaptionsPage() {
    //this.navCtrl.push(AdaptionsPage, {});
    this.navCtrl.popToRoot();
  }

}
