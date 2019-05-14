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

  awardType: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalAwardsPage');

    this.awardType = this.navParams.get('data'); //können hiermit Daten ins Modal speisen

    console.log("text data filtered from entry-overview page", this.awardType);

  }

  public closeModal() {

    this.viewCtrl.dismiss();
    /*const data = {
      name: 'John Doe',
      occupation: 'Milkman'
    };*/
  }

}
