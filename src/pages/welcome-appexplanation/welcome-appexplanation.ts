import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { MidataService } from '../../services/MidataService';
import { OnboardingProfileCapturePage } from '../onboarding-profile-capture/onboarding-profile-capture';
import { Page } from 'ionic-angular/umd/navigation/nav-util';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-welcome-appexplanation',
  templateUrl: 'welcome-appexplanation.html',
})
export class WelcomeAppexplanationPage {

  nextPage: Page;

  isOnboardingDone: boolean;

  constructor(
    private app: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private midataService: MidataService,
    private storage: Storage
  ) {
    this.nextPage = OnboardingProfileCapturePage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomeAppexplanationPage');

    let that = this;
    this.storage.get('DidOnboarding').then((value) => {
      that.isOnboardingDone = value;
      console.log("ionViewDidLoad() -> this.storage.get() -> that.isOnboardingDone:", that.isOnboardingDone);
    });
  }

  gotoWelcomeCapturePage() {
    this.navCtrl.push(OnboardingProfileCapturePage);
  }

  /**
   * Navigates to the next page.
   */
  public goNext() {
    console.log("goNext() -> isOnboardingDone: ", this.isOnboardingDone);

    let loading = this.loadingCtrl.create({
      content: 'Bitte warten...'
    });

    loading.present().catch();

    this.midataService.authenticate()
      .then((success: boolean) => {

        if (this.isOnboardingDone) {
          this.nextPage = TabsPage;
        }

        console.log("this.navCtrl.getPrevious(): ", this.navCtrl.getPrevious());
        let currentIndex = this.navCtrl.getActive().index;
        console.log("currentIndex: ", currentIndex);
        this.navCtrl.push(this.nextPage).then(() => {
          this.navCtrl.remove(currentIndex);
        });

        //this.goToTabsPage();//this.navCtrl.popTo(this.nextPage);//this.app.getActiveNav().setRoot(this.nextPage);//this.navCtrl.setRoot(this.nextPage);
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

  goToTabsPage() {

    return this.navCtrl.push(TabsPage, {}); //same problem
  }
}
