import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ModalCopingStrategyInstantFeedbackPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-coping-strategy-instant-feedback',
  templateUrl: 'modal-coping-strategy-instant-feedback.html',
})
export class ModalCopingStrategyInstantFeedbackPage {

  entryType: string;

  isCopingStrategyEntry: boolean;
  isGoalEntry: boolean;

  constructor(public navCtrl: NavController, private viewCtrl: ViewController, public navParams: NavParams) {

    this.isCopingStrategyEntry = false;
    this.isGoalEntry = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalCopingStrategyInstantFeedbackPage');

    this.entryType = this.navParams.get('data'); //können hiermit Daten ins Modal speisen

    if (this.entryType == "copingStrategyEntry") {
      this.isCopingStrategyEntry = true;
    }

    else {
      this.isGoalEntry = true;
    }
  }

  public closeModal() {

    this.viewCtrl.dismiss();
  }

}
