import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OnboardingBiovotionPage } from '../onboarding-biovotion/onboarding-biovotion';
import { OnboardingContactCapturePage } from '../onboarding-contact-capture/onboarding-contact-capture';
import { OnboardingReferencePersonContactCapturePage } from '../onboarding-referenceperson-contact-capture/onboarding-referenceperson-contact-capture';

import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup } from '@angular/forms';
import { validatePhoneIfNotEmpty, validateEmailIfNotEmpty } from '../../services/validators';

/**
 * Generated class for the OnboardingSpecialistContactCapturePage page.
 *
 * @author kochd1
 */

@IonicPage()
@Component({
  selector: 'page-onboarding-specialist-contact-capture',
  templateUrl: 'onboarding-specialist-contact-capture.html',
})
export class OnboardingSpecialistContactCapturePage {

  fachperson_inputtext: string;
  fachperson_telefonnummer: any;
  fachperson_email: string;
  fachperson_emailtext: string;

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
      email: ['', validateEmailIfNotEmpty],
      emailtext: ['']
    });

    this.getData();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OnboardingSpecialistContactCapturePage');
  }

  //Lokal Storage
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
      this.storage.set('fachperson_inputtext', this.fachperson_inputtext),
      this.storage.set('fachperson_telefonnummer', this.fachperson_telefonnummer),
      this.storage.set('fachperson_email', this.fachperson_email),
      this.storage.set('fachperson_emailtext', this.fachperson_emailtext)
    ]).then(() => {
      this.gotoOnboardingBiovotionPage();
    })
  }

  /**
   * Gets the contact data from the local storage.
   */
  getData() {
    let that = this;

    // TODO: move to separate service...
    this.storage.get('fachperson_inputtext').then((value) => {
      that.fachperson_inputtext = value;
    });

    this.storage.get('fachperson_telefonnummer').then((value) => {
      that.fachperson_telefonnummer = value;
    });

    this.storage.get('fachperson_email').then((value) => {
      that.fachperson_email = value;
    });

    this.storage.get('fachperson_emailtext').then((value) => {
      that.fachperson_emailtext = value;
    });
  }



  public gotoOnboardingReferencePersonContactPage() {
    this.navCtrl.push(OnboardingReferencePersonContactCapturePage, {});
  }

  public gotoOnboardingBiovotionPage() {
    this.navCtrl.push(OnboardingBiovotionPage, {});
  }

}
