import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

//import documentationEntry utility class
import { DocumentationEntry } from '../../classes/documentationEntry';

/**
 * Generated class for the ModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {

  documentationEntry: DocumentationEntry;

  documentationEntryText: string;

  constructor(public navCtrl: NavController, 
              private viewCtrl: ViewController,
              public navParams: NavParams) {

                //let newDate: Date = new Date();
    this.documentationEntry = new DocumentationEntry(0, new Date(), "");

    console.log("constr() -> this.documentationEntry", this.documentationEntry);
  }

  ionViewWillLoad(){
    //data fetch was originally here before

    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalPage');

    this.documentationEntry = this.navParams.get('data'); //undefined!          können hiermit Daten ins Modal speisen
    console.log("data from entry-overview page", this.documentationEntry);

    this.documentationEntryText = this.documentationEntry.entryText;
    console.log("text data filtered from entry-overview page", this.documentationEntryText);
  }

  public setEntryText(){
    this.viewCtrl.dismiss(this.documentationEntryText); //können Daten auch zurück zur eigentlichen Seite speisen.
  }

  public closeModal(){

    this.viewCtrl.dismiss();
    /*const data = {
      name: 'John Doe',
      occupation: 'Milkman'
    };*/
  }

}
