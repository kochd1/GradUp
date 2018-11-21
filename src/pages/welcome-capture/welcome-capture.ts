import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WelcomeContactPage } from '../welcome-contact/welcome-contact';
import { Storage } from '@ionic/storage';
import { BodyWeight, Observation } from 'Midata';
import { MidataService } from '../../services/MidataService';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'
import * as Globals from '../../../typings/globals';
/**
 * Generated class for the WelcomeCapturePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome-capture',
  templateUrl: 'welcome-capture.html',
})
export class WelcomeCapturePage {

  inputtext:string;
  key:string="username";

  information: any[];

  currentWeight;

  constructor(public navCtrl: NavController, private http: Http, public navParams: NavParams, private storage: Storage, private midataService: MidataService) {
    let localData = http.get('assets/information.json').map(res => res.json().items);
    localData.subscribe(data => {
      this.information = data;
    })
  }

  toggleSection(i) {
    this.information[i].open = !this.information[i].open;
  }
 
  toggleItem(i, j) {
    this.information[i].children[j].open = !this.information[i].children[j].open;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomeCapturePage');
  }

  public gotoWelcomeContactPage() {
    this.navCtrl.push(WelcomeContactPage, {});
  }
  
  //saves the data locally and also on MIDATA
  saveData() {
    this.storage.set(this.key, this.inputtext);
    this.storage.get(this.key).then((val) => {
      console.log('Your username is', val);
    });

    //MIDATA persistance
    this.midataService.save(new BodyWeight(+this.currentWeight, new Date().toISOString()));

  }

  private loadData(): void {
    this.midataService.search('Observation/$lastn', { max: 1000, _sort: '-date', code: Globals.BODYWEIGHT.toString, patient: this.midataService.getUser().id })
      .then(response => {
        if( response.length > 0) {


          response.forEach((measure: Observation) => {
            console.log(measure.getProperty('valueQuantity')['value'], measure.getProperty('effectiveDateTime'));
            //this.addPulseMeasure(measure.getProperty('valueQuantity')['value'], measure.getProperty('effectiveDateTime'));
          });
          /* TODO:  to test */
          /* TODO: catch error */
        }
      }
      );
  }

}
