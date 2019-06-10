import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OnboardingContactCapturePage } from '../onboarding-contact-capture/onboarding-contact-capture';
import { Storage } from '@ionic/storage';

import { NotificationService } from '../../services/notification.service';

//Form Validation
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

//validators
import { validateWeightInputFormat, validateWeightGainInputFormat, validateWeightGainRange } from '../../services/validators';

//#MIDATA imports
import { BodyWeight, Observation } from 'Midata';
import { Goal } from '../../resources/goal';
import { MidataService } from '../../services/MidataService';
import * as Globals from '../../../typings/globals';

//Accordion
import { MyResource } from '../../resources/occupation';



/**
 * Generated class for the OnboardingProfileCapturePage page.
 *
 * @author kochd1
 */

@IonicPage()
@Component({
  selector: 'page-onboarding-profile-capture',
  templateUrl: 'onboarding-profile-capture.html',
})
export class OnboardingProfileCapturePage {

  /**
   * stores the username
   */
  username: string;

  /**
   * storage key user name
   */
  usernameKey: string = "username";

  /**
   * storage key weight
   */
  currentWeightKey: string = "currentWeight";

  /**
   * storage key weight gain
   */
  weightGainKey: string = "weightGain";

  /**
   * stores the work occupation
   */
  workOccupation: string;



  /*relationship_status: string;
  key1: string = "relationship_status";

  hobbies_status: string;
  key2: string = "hobbies_status";

  pet_input: string;
  key3: string = "pet_input";

  pet_status: string;
  key4: string = "pet_status";

  residential_input: string;
  key5: string = "residential_input";

  residential_status: string;
  key6: string = "residential_status";*/


  /**
   * #MIDATA -> array for the weight data
     store the raw data in this array.
   */
  weightData: Array<{ date: Date, value: number }>;

  //Global variable for current weight
  currentWeight: any;

  //Global variable for goal weight
  weightGain: number;

  items: any;

  //Form validation
  isSubmitted: boolean = false;
  formGroup: FormGroup;

  constructor(
    private zone: NgZone,
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private midataService: MidataService,
    private notificationService: NotificationService,
    formBuilder: FormBuilder
  ) {

    //Form validation
    this.formGroup = formBuilder.group({
      usernameValidation: ['', Validators.required],
      occupationValidation: ['', Validators.required],
      currentWeightValidation: ['', validateWeightInputFormat],
      weightGainValidation: ['', Validators.compose([validateWeightGainInputFormat, validateWeightGainRange])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OnboardingProfileCapturePage');
  }

  public gotoWelcomeContactPage() {
    this.navCtrl.push(OnboardingContactCapturePage, {});
  }

  //saves the data locally and also on MIDATA
  saveData() {
    this.isSubmitted = true;

    if (!this.formGroup.valid) {
      this.zone.run(() => {
        // force ui repaint
      });
      return
    }

    let MessageDate = new Date();
    this.storage.set(this.usernameKey, this.username);
    //this.storage.set(this.key1, this.relationship_status);
    this.storage.set('workOccupation', this.workOccupation);
    //this.storage.set(this.key2, this.hobbies_status);
    //this.storage.set(this.key3, this.pet_input);
    //this.storage.set(this.key4, this.pet_status);
    //this.storage.set(this.key5, this.residential_input);
    //this.storage.set(this.key6, this.residential_status);

    this.storage.set(this.currentWeightKey, this.currentWeight);
    this.storage.set(this.weightGainKey, this.weightGain);

    // #MIDATA persistance: add Weight
    var saveWeight = this.midataService.save(new BodyWeight(+this.currentWeight, MessageDate.toISOString()));



    // #MIDATA persistance: add Goal
    let goal = new Goal(this.weightGain);
    let saveGoal = this.midataService.save(goal)
      .then((response) => {
        console.log("goal saved", response);
      })
      .catch((error) => {
        console.error("Error in save request:", error);
      });

    // #MIDATA persistance: add Occupation
    let occupation = new MyResource(this.workOccupation);
    let saveOccupation = this.midataService.save(occupation)
      .then((response) => {
        console.log("occupation saved", response);
      })
      .catch((error) => {
        console.error("Error in save request:", error);
      });

    Promise.all([
      //saveWeight,
      //saveGoal,
      saveOccupation
    ]).then(() => {
      this.notificationService.createWeeklyWeightNotification();
      this.gotoWelcomeContactPage();
    });
  }
}
