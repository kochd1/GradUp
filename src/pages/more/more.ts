import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, AlertController, PopoverController, NavParams, LoadingController, App } from 'ionic-angular';

//component
import { PopoverComponent } from '../../components/popover/popover';

import { MoreImpressumPage } from '../more-impressum/more-impressum';
import { MorePrivacyPage } from '../more-privacy/more-privacy';
import { MoreTermsPage } from '../more-terms/more-terms';
import { MoreProfileAdaptionsPage } from '../more-profile-adaptions/more-profile-adaptions';
import { MoreContactsAdaptionsPage } from '../more-contacts-adaptions/more-contacts-adaptions';
import { AdaptionsBiovotionPage } from '../adaptions-biovotion/adaptions-biovotion';
import { MoreAwardsPage } from '../more-awards/more-awards'
import { JournalPage } from '../journal/journal';

import { Storage } from '@ionic/storage';
import { MidataService } from '../../services/MidataService';


@IonicPage()
@Component({
  selector: 'page-more',
  templateUrl: 'more.html',
})
export class MorePage {

  /**
  * Indicates, if the Biovotion Everion Sensor is connected to GradUp.
  * Default -> false
  */
  isConnectedToSensor: boolean = false;

  /**
 * key for local storage of isConnectedToSensor value
 */
  key_sensor: string = "isConnectedToSensor";

  constructor(
    public app: App,
    private midataService: MidataService,
    public navCtrl: NavController,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
    private loadingCtrl: LoadingController,
    public navParams: NavParams,
    private storage: Storage
  ) { }

  ionViewWillEnter() {

    this.storage.get(this.key_sensor).then((value) => {
      this.isConnectedToSensor = value;
      console.log('profile.ts ionViewWillEnter() -> isConnectedToSensor?:', value);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdaptionsPage');
  }

  presentPopover(myEvent) {
    let myPopoverData = {
      infoText: "Hier kannst du deine Profil- und Kontaktangaben anpassen, deine Sensor- und MIDATA-Verbindungen verwalten, GradUp Auszeichnungen ansehen und weitere Infos zur App erhalten. "
    }
    let popover = this.popoverCtrl.create(PopoverComponent, { data: myPopoverData });
    popover.present({
      ev: myEvent
    });
  }

  public gotoMoreProfileAdaptionsPage() {
    this.navCtrl.push(MoreProfileAdaptionsPage, {});
  }

  public gotoMoreContactsAdaptionsPage() {
    this.navCtrl.push(MoreContactsAdaptionsPage, {});
  }

  public gotoProfileBiovotionPage() {
    this.navCtrl.push(AdaptionsBiovotionPage, {});
  }

  public gotoMoreAwardsPage() {
    this.navCtrl.push(MoreAwardsPage, {});
  }

  public gotoMoreImpressumPage() {
    this.navCtrl.push(MoreImpressumPage, {});
  }

  public gotoMorePrivacyPage() {
    this.navCtrl.push(MorePrivacyPage, {});
  }

  public gotoMoreTermsPage() {
    this.navCtrl.push(MoreTermsPage, {});
  }

  public isLoggedIn(): boolean {
    const user = this.midataService.getUser();
    const result = user && (parseInt(user.id) > 0);
    return result;
  }

  public checkSensorConnection(): boolean {

    return this.isConnectedToSensor; //true, if connected
  }

  //MIDATA Logout
  public logout() {

    let logoutAlert = this.alertCtrl.create({
      title: 'Verbindung zu MIDATA trennen?',
      subTitle: 'Die Studiendaten werden somit nicht mehr übertragen!',
      cssClass: 'alert-button-inner',
      buttons: [
        {
          text: 'Ja',
          handler: () => {
            this.midataService.logout()
              .then(() => {
                this.menuCtrl.close();
                this.selectJournalPage();
              })
              .catch(() => {
                this.selectJournalPage();
              })
          }
        },
        {
          text: 'Nein',
          handler: () => {
            //do nothing
          }
        }
      ]
    });

    logoutAlert.present();


  }

  // MIDATA Login
  public login() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present().catch();

    this.midataService.authenticate()
      .then((success: boolean) => {
        this.selectJournalPage();
      })
      .then(() => {
        loading.dismiss().catch();
      })
      .catch((error) => {
        console.log(error);
        console.log(this.midataService.getNetworkState());
        loading.dismiss().catch();
      })
  }

  public selectJournalPage() {
    // select JournalPage (tab 0 of tab page)
    //return this.navCtrl.setRoot(JournalPage);
    return this.navCtrl.parent.select(0);
  }

}
