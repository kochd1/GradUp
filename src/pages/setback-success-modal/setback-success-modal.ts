import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

//import setbackSuccessDocumentationEntry utility class
import { SetbackSuccessDocumentationEntry } from '../../classes/setbackSuccessdocumentationEntry';


@IonicPage()
@Component({
  selector: 'page-setback-success-modal',
  templateUrl: 'setback-success-modal.html',
})
export class SetbackSuccessModalPage {

  setbackSuccessDocumentationEntry: SetbackSuccessDocumentationEntry;

  documentationEntrySubjectText: string;

  documentationEntryReasonText: string;

  constructor(public navCtrl: NavController, private viewCtrl: ViewController, public navParams: NavParams) {

    this.setbackSuccessDocumentationEntry = new SetbackSuccessDocumentationEntry(0, new Date(), "", "");

    console.log("constr() -> this.setbackSuccessDocumentationEntry", this.setbackSuccessDocumentationEntry);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetbackSuccessModalPage');

    this.setbackSuccessDocumentationEntry = this.navParams.get('data'); //können hiermit Daten ins Modal speisen
    console.log("data from entry-overview page", this.setbackSuccessDocumentationEntry);

    this.documentationEntrySubjectText = this.setbackSuccessDocumentationEntry.entrySubjectText;
    console.log("subject text data filtered from entry-overview page", this.documentationEntrySubjectText);

    this.documentationEntryReasonText = this.setbackSuccessDocumentationEntry.entryReasonText;
    console.log("reason text data filtered from entry-overview page", this.documentationEntryReasonText);
  }

   /**
   * Modal dismissed the entry text to the respective class.
   */
  public setEntryText(){
    let entryData = {
      subject: this.documentationEntrySubjectText,
      reason: this.documentationEntryReasonText
    }
    this.viewCtrl.dismiss(entryData);
    
    console.log("Modal setEntryText() -> this.documentationEntrySubjectText", this.documentationEntrySubjectText);
    console.log("Modal setEntryText() -> this.documentationEntryReasonText", this.documentationEntryReasonText);
    console.log("Modal setEntryText() -> entryData", entryData);
  }

  public closeModal(){

    this.viewCtrl.dismiss();
    /*const data = {
      name: 'John Doe',
      occupation: 'Milkman'
    };*/
  }

}
