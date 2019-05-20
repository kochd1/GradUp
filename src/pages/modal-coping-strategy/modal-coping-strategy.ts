import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

//import documentationEntry utility class
import { DocumentationEntry } from '../../classes/documentationEntry';

/**
 * Generated class for the ModalCopingStrategyPage page.
 *
 * @author kochd1
 */

@IonicPage()
@Component({
  selector: 'page-modal-coping-strategy',
  templateUrl: 'modal-coping-strategy.html',
})
export class ModalCopingStrategyPage {

  strategyEntry: DocumentationEntry;

  strategyEntryText: string;

  constructor(public navCtrl: NavController,
    private viewCtrl: ViewController,
    public navParams: NavParams) {

    //let newDate: Date = new Date();
    this.strategyEntry = new DocumentationEntry(0, new Date(), "");

    console.log("modal constr() -> this.strategyEntry", this.strategyEntry);
  }

  ionViewWillLoad() {
    //data fetch was originally here before


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalPage');

    this.strategyEntry = this.navParams.get('data'); //können hiermit Daten ins Modal speisen
    console.log("data from entry-overview page", this.strategyEntry);

    this.strategyEntryText = this.strategyEntry.entryText;
    console.log("text data filtered from entry-overview page", this.strategyEntryText);
  }

  /**
   * Modal dismissed the entry text to the respective class.
   */
  public setEntryText() {
    this.viewCtrl.dismiss(this.strategyEntryText);
  }

  public closeModal() {

    this.viewCtrl.dismiss();
    /*const data = {
      name: 'John Doe',
      occupation: 'Milkman'
    };*/
  }

}
