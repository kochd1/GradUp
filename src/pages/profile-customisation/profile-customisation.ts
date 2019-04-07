import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AdaptionsPage } from '../adaptions/adaptions';
import { Storage } from '@ionic/storage';

//Form Validation
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the WelcomeCapturePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile-customisation',
  templateUrl: 'profile-customisation.html',
})
export class ProfileCustomisationPage {

  inputtext: string;
  key: string = "username";

  /**
   * #MIDATA -> array for the weight data 
     store the raw data in this array.
   */

  //Global variable for work Occupation
  userType: number;

  items: any;

  //Form Validation 
  isSubmitted: boolean = false;
  formGroup: FormGroup;

  constructor(
    private zone: NgZone,
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    //private midataService: MidataService,
    formBuilder: FormBuilder
  ) {

    //Form Validation
    this.formGroup = formBuilder.group({
      usernameValidation: ['', Validators.required],
      occupationValidation: ['', Validators.required]
    });

    this.getData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileCustomisationPage');
  }

  getData() {
    let that = this;

    // TODO: move to separate service...

    this.storage.get('username').then((value) => {
      that.inputtext = value;
    });

    this.storage.get('userType').then((value) => {
      that.userType = value;
    });
  }

  saveData() {

    this.isSubmitted = true;

    if (!this.formGroup.valid) {
      this.zone.run(() => {
        // force ui repaint
      })
      return
    }

    // TODO: move to separate service...
    let saveAll = [
      this.storage.set('username', this.inputtext),
      this.storage.set('userType', this.userType),
    ]

    Promise.all(saveAll).then(() => {
      this.gotoAdaptionsPage();
    });
  }


  public gotoAdaptionsPage() {
    this.navCtrl.push(AdaptionsPage, {});
  }

}