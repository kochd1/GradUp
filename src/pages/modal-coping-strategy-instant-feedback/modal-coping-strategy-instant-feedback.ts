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

  constructor(public navCtrl: NavController, private viewCtrl: ViewController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalCopingStrategyInstantFeedbackPage');
  }

  public closeModal(){

    this.viewCtrl.dismiss();
  }

}
