import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

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

  documentationEntryText: string;

  constructor(public navCtrl: NavController, 
              private viewCtrl: ViewController,
              public navParams: NavParams) {
  }

  ionViewWillLoad(){
    this.documentationEntryText = this.navParams.get('data'); //können Daten ins Modal speisen
    console.log(this.documentationEntryText);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalPage');
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
