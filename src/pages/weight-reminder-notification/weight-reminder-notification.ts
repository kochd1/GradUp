import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { BodyWeight, Observation, Resource } from 'Midata';
import { MidataService } from '../../services/MidataService';
import { Goal } from '../../resources/goal';
import * as Globals from '../../../typings/globals';
import { Storage } from '@ionic/storage';
import { FormBuilder, Validators } from '@angular/forms';
import { validateWeightInputFormat, validateWeightGainInputFormat, validateWeightGainRange } from '../../services/validators';

/**
 * Generated class for the WeightReminderNotificationPage page.
 *
 * @author kochd1
 */
@IonicPage()
@Component({
  selector: 'page-weight-reminder-notification',
  templateUrl: 'weight-reminder-notification.html'
})
export class WeightReminderNotificationPage {

  state = 'FORM';
  message: string;
  currentWeight: any;
  //currentGoal: any;
  weightGain: any;
  previousWeight: any;
  previousGoal: any;
  userName: any;

  formGroup: any;
  isSubmitted: boolean;


  constructor(
    private zone: NgZone,
    public navCtrl: NavController,
    public navParams: NavParams,
    private midataService: MidataService,
    private storage: Storage,
    private alertCtrl: AlertController,
    formBuilder: FormBuilder
  ) {
    this.formGroup = formBuilder.group({
      currentWeightValidation: ['', validateWeightInputFormat],
      weightGainValidation: ['', Validators.compose([validateWeightGainInputFormat, validateWeightGainRange])]
    });
  }

  ionViewDidLoad() {
    console.log('WeightReminderNotificationPage.ionViewDidLoad()');

    //let userId = this.midataService.getUser().id;
    //console.log('ionViewDidLoad() : userId:=', userId);

    this.storage.get("username").then(username => {
      this.userName = username;
      console.log('ionViewDidLoad() : userName:=', this.userName);
    });

    this.storage.get('currentWeight').then(currentWeight => {
      this.previousWeight = currentWeight;
      console.log("previousWeight", this.previousWeight);
    });

    this.storage.get('weightGain').then(weightGain => {
      this.previousGoal = weightGain;
      console.log("previousGoal: ", this.previousGoal);
    });

    /*this.midataService
      .search('Observation/$lastn', {
        max: 1,
        _sort: '-date',
        code: Globals.BODYWEIGHT.toString,
        patient: userId
      })
      .then(response => {
        (response || []).forEach((measure: Observation) => {
          let value = measure.getProperty('valueQuantity');
          this.previousWeight = value['value'];
          console.log('ionViewDidLoad() : previousWeight:=', this.previousWeight);
        });
      })
      .catch((error) => {
        console.error('ionViewDidLoad() : failed to load previousWeight', error);
        this.previousWeight = 0;
      });

    this.midataService
      .search('Goal', {
        //max: 1,
        //_sort: '-date',
        category: 'dietary'
      })
      .then(response => {
        let goal = response[0];
        let detailQuantity = goal.getProperty('target').detailQuantity;
        let val = detailQuantity.value;
        let unit = detailQuantity.unit;
        console.log('ionViewDidLoad() : val:=', val, unit);

        this.previousGoal = parseInt(val);
        console.log('ionViewDidLoad() : previousGoal:=', this.previousGoal);
      })
      .catch((error) => {
        console.error('ionViewDidLoad() : failed to load previousGoal', error);
        this.previousGoal = 0;
      });*/

  }

  saveData() {
    this.isSubmitted = true;

    if (!this.formGroup.valid) {
      this.zone.run(() => {
        // force ui repaint
      });
      return
    }

    let currentWeight = parseFloat(this.currentWeight);
    this.storage.set('currentWeight', this.currentWeight);
    console.log("currentWeight: ", currentWeight);

    this.storage.set('weightGain', this.weightGain);
    console.log("weightGain: ", this.weightGain);

    let previousWeight = parseFloat(this.previousWeight);
    console.log("previousWeight: ", previousWeight);
    if (currentWeight === NaN || previousWeight === NaN) {
      this.zone.run(() => {
        this.message = "Ungültige Eingabe";
      });
      return;
    }

    let weightChange = Math.round((currentWeight - previousWeight) * 1000);
    console.log("weight change", weightChange);
    let message = '';

    if (weightChange == this.previousGoal) {
      message = `Toll ${this.userName}, du hast dein Ziel erreicht, mach weiter so! :)`;
    } else if (weightChange > this.previousGoal) {
      message = `Super ${this.userName}, du hast dein Ziel übertroffen, mach weiter so! :)`;
    } else {
      message = `Schade ${this.userName}, leider hast du dein Ziel nicht erreicht. :( Bitte schau besser zu dir und deinem Körper.`;
    }

    let alert = this.alertCtrl.create({
      title: '',
      subTitle: message,
      cssClass: 'alert-button-inner',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.gotoTabsPage();
          }
        }
      ]
    });

    alert.present();

    console.log("saveData() : ", weightChange, "gr.", message);

    let saveWeight = new BodyWeight(this.currentWeight, new Date().toISOString());//this.midataService.save(new BodyWeight(this.currentWeight, new Date().toISOString()))

    let goal = new Goal(this.weightGain);
    let saveGoal = goal; //this.midataService.save(goal);

    // let saveWeight = new Promise<Resource>((resolve) => {
    //   resolve(null);
    // });

    // let saveGoal = new Promise<Resource>((resolve) => {
    //   resolve(null);
    // });

    /*Promise.all([saveWeight, saveGoal])
      .then(() => {
        this.zone.run(() => {
          //this.state = 'DONE';
          //this.message = message;
          console.log("saveData() : DONE", this.message);
        });
      })
      .catch((error) => {
        this.zone.run(() => {
          this.message = 'Gewicht konnte nicht gespeichert werden. Bitte versuche es nochmals';
          this.state = 'FORM';
        });
      })*/
  }

  public gotoTabsPage() {
    this.navCtrl.push(TabsPage, {});
  }

}
