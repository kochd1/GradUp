import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser'
import { InformationDocumentationPage } from '../information-documentation/information-documentation';

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
              private inAppBrowser: InAppBrowser) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InformationAnorexiaPage');
  }

  public openWebPage(url: string){
    const options: InAppBrowserOptions = {

    }
    //opening a URL and returning an InAppBrowserObject
    this.inAppBrowser.create(url,'_self'); //options -> not required

    //const browser...
  }

  public gotoInformationPage() {
    //this.navCtrl.push(InformationPage, {});
    this.navCtrl.popToRoot();
  }

}
