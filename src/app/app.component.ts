import { Component } from '@angular/core';
import { Platform, LoadingController, AlertController, Alert, Loading, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

//services
import { AwardService } from '../services/awards.service';
import { MidataService } from '../services/MidataService';

import { TabsPage } from '../pages/tabs/tabs';
import { WelcomePage } from '../pages/welcome/welcome';
import { JournalPage } from '../pages/journal/journal';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any; //= TabsPage //= WelcomePage;
  loadingDisplay: Loading;

  constructor(
    private app: App,
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private midataService: MidataService,
    private awardService: AwardService,
    private storage: Storage
  ) {
    splashScreen.show();

    platform.ready()
      .then(() => {

        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        statusBar.styleLightContent();   //styleDefault(); //dark text for light backgrounds
        splashScreen.hide();

        let startCount;
        this.storage.get('StartCount').then((value => {

          if (value == null) {
            console.log("platform.ready() StartCount value: ", value);
            startCount = this.storage.set('StartCount', 1);
            console.log("platform.ready() StartCount var after init: ", startCount);
          }

          else {
            startCount = this.storage.set('StartCount', value + 1);
            console.log("platform.ready() StartCount var after +1 : ", startCount);
          }

          this.awardService.initializeAwardManagement();

        }));

        // this does not work in the browser.
        // only in cordova, this makes development quite tricky.
        return this.midataService.openSession()
      })


      .then((result) => {
        console.log("appComponent() : openSession success", result);
        console.log("appComponent() : midata user", this.midataService.getUser());
        this.rootPage = TabsPage;
        this.gotoJournalPage();

      })
      .catch((result) => {
        console.log("appComponent() : openSession failed", result);

        this.rootPage = WelcomePage;

        this.storage.get("username").then((username: any) => {
          console.log("appComponent() : storage username:=", username);
          if (username) {
            // => So it would be correct, it is checked whether a user name is already set. If yes, it goes directly to the diary page. For demonstration purposes the start is at the welcome page.
            // this.gotoJournalPage();
          }
        });
      });
  }

  private gotoJournalPage() {
    console.log("app.component -> gotoJournalPage()");
    this.app.getActiveNav().setRoot(TabsPage);
  }

  // Helper method. Provide a loading animation
  private getLoadingDisplay(): Loading {
    return this.loadingDisplay = this.loadingCtrl.create({
      content: "Bitte warten..."
    })
  }

  // Helper method. Provide a popup dialog
  private getPopupDialog(title: string, message: string): Alert {
    return this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
  }
}

