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

  success: boolean;

  constructor(
    private app: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private midataService: MidataService,
    private storage: Storage
  ) {
    this.nextPage = OnboardingProfileCapturePage;
    this.success = false;
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

    let that = this;

    if (this.isOnboardingDone) {
      this.nextPage = TabsPage;
    }

    let loading = this.loadingCtrl.create({
      content: 'Bitte warten...'
    });

    loading.present().catch();

    this.midataService.authenticate()
      .then((success: boolean) => {

        console.log("this.midataService -> success: ", success);

        that.success = success;
        this.success = success;

        console.log("this.midataService -> that.success: ", that.success);
        console.log("this.midataService -> this.success: ", this.success);
        //this.pushNextPage(); --> segment view error
        //this.goToTabsPage();//this.navCtrl.popTo(this.nextPage);//this.app.getActiveNav().setRoot(this.nextPage);//this.navCtrl.setRoot(this.nextPage);
      })
      .then(() => {
        //this.pushNextPage(); --> segment view error
        loading.dismiss().catch();
        //this.pushNextPage(); --> segment view error

      })
      /*.then(() => {
        this.pushNextPage(); --> segment view error
      })*/
      .catch((error) => {
        console.log(error);
        console.log(this.midataService.getNetworkState());
        loading.dismiss().catch();
      });

    this.pushNextPage(); //workaround -> dirty load -> load TabsPage, even when the login is not successful


  }

  pushNextPage() {
    console.log("pushNextPage() called");
    //console.log("pushNextPage() -> this.success: ", this.success);
    return this.navCtrl.push(this.nextPage, {});
  }
}
