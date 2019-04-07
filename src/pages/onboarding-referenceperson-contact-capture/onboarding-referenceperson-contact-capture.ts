import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OnboardingSpecialistContactCapturePage } from '../onboarding-specialist-contact-capture/onboarding-specialist-contact-capture';
import { OnboardingContactCapturePage } from '../onboarding-contact-capture/onboarding-contact-capture';

import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup } from '@angular/forms'; 
import { validatePhoneIfNotEmpty, validateEmailIfNotEmpty } from '../../services/validators';

/**
 * Generated class for the WelcomeContact2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-onboarding-referenceperson-contact-capture',
  templateUrl: 'onboarding-referenceperson-contact-capture.html',
})
export class OnboardingReferencePersonContactCapturePage {

  bezugsperson_inputtext: string;
  bezugsperson_telefonnummer: any;
  bezugsperson_smstext: string;
  bezugsperson_email: string;
  bezugsperson_emailtext: string;

  isSubmitted: boolean = false;
  formGroup: FormGroup; 

  constructor(
    private zone: NgZone,
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    formBuilder: FormBuilder
  ) {
  
    this.formGroup = formBuilder.group({
      inputtext: [''],
      telefonnummer: ['', validatePhoneIfNotEmpty],
      smstext: [''],
      email: ['', validateEmailIfNotEmpty],
      emailtext: ['']
    });

    this.getData();
  }

  /**
   * Saves the contact data to the local storage.
   */  
  saveData() {

    this.isSubmitted = true;
 
    if (!this.formGroup.valid) {
      this.zone.run(() => {
        // force ui repaint
      });
      return
    }

    // TODO: move to separate service...
    Promise.all([
      this.storage.set('bezugsperson_inputtext', this.bezugsperson_inputtext),
      this.storage.set('bezugsperson_telefonnummer', this.bezugsperson_telefonnummer),
      this.storage.set('bezugsperson_smstext', this.bezugsperson_smstext),
      this.storage.set('bezugsperson_email', this.bezugsperson_email),
      this.storage.set('bezugsperson_emailtext', this.bezugsperson_emailtext)
    ]).then(() => {
      this.gotoOnboardingSpecialstContactCapturePage();
    })  
  }

  /**
   * Gets the contact data from the local storage.
   */
  getData() {
    let that = this;

    // TODO: move to separate service...
    this.storage.get('bezugsperson_inputtext').then((value) => {
      that.bezugsperson_inputtext = value;
    });

    this.storage.get('bezugsperson_telefonnummer').then((value) => {
      that.bezugsperson_telefonnummer = value;
    });

    this.storage.get('bezugsperson_smstext').then((value) => {
      that.bezugsperson_smstext = value;
    });

    this.storage.get('bezugsperson_email').then((value) => {
      that.bezugsperson_email = value;
    });

    this.storage.get('bezugsperson_emailtext').then((value) => {
      that.bezugsperson_emailtext = value;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomeContact2Page');
  }

  public gotoOnboardingContactCapturePage() {
    this.navCtrl.push(OnboardingContactCapturePage, {});
  }

  public gotoOnboardingSpecialstContactCapturePage() {
    this.navCtrl.push(OnboardingSpecialistContactCapturePage, {});
  }

}
