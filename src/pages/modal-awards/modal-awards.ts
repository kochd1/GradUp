import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ModalAwardsPage page.
 *
 * @author kochd1
 */

@IonicPage()
@Component({
  selector: 'page-modal-awards',
  templateUrl: 'modal-awards.html',
})
export class ModalAwardsPage {

  data: any;
  awardType: string;
  isReceived: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalAwardsPage');

    this.data = this.navParams.get('data'); //können hiermit Daten ins Modal speisen

    this.awardType = this.data.awardType;
    console.log("awardType filtered", this.awardType);

    this.isReceived = this.data.isReceived;
    console.log("isReceived filtered", this.isReceived);

  }

  public closeModal() {

    this.viewCtrl.dismiss();
    /*const data = {
      name: 'John Doe',
      occupation: 'Milkman'
    };*/
  }

}
