import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, AlertController, NavParams, LoadingController, App } from 'ionic-angular';
import { ProfileImpressumPage } from '../profile-impressum/profile-impressum';
import { ProfilePrivacyPage } from '../profile-privacy/profile-privacy';
import { ProfileTermsPage } from '../profile-terms/profile-terms';
import { ProfileCustomisationPage } from '../profile-customisation/profile-customisation';
import { ProfileCustomizecontactsPage } from '../profile-customizecontacts/profile-customizecontacts';
import { AdaptionsBiovotionPage } from '../adaptions-biovotion/adaptions-biovotion';
import { MoreAwardsPage } from '../more-awards/more-awards'
import { JournalPage } from '../journal/journal';
import { Storage } from '@ionic/storage';
import { MidataService } from '../../services/MidataService';


@IonicPage()
@Component({
  selector: 'page-adaptions',
  templateUrl: 'adaptions.html',
})
export class AdaptionsPage {

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

  public gotoProfileCustomizePage() {
    this.navCtrl.push(ProfileCustomisationPage, {});
  }

  public gotoProfileCustomizecontactsPage() {
    this.navCtrl.push(ProfileCustomizecontactsPage, {});
  }

  public gotoProfileBiovotionPage() {
    this.navCtrl.push(AdaptionsBiovotionPage, {});
  }

  public gotoMoreAwardsPage() {
    this.navCtrl.push(MoreAwardsPage, {});
  }

  public gotoProfileImpressumPage() {
    this.navCtrl.push(ProfileImpressumPage, {});
  }

  public gotoProfilePrivacyPage() {
    this.navCtrl.push(ProfilePrivacyPage, {});
  }

  public gotoProfileTermsPage() {
    this.navCtrl.push(ProfileTermsPage, {});
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
