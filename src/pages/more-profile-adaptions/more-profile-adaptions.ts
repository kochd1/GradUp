import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

//component
import { PopoverComponent } from '../../components/popover/popover';

//Form Validation
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MidataService } from '../../services/MidataService';

import { MyResource } from '../../resources/occupation';

/**
 * Generated class for the MoreProfileAdaptionsPage page.
 *
 * @author kochd1
 */

@IonicPage()
@Component({
  selector: 'page-more-profile-adaptions',
  templateUrl: 'more-profile-adaptions.html',
})
export class MoreProfileAdaptionsPage {

  inputtext: string;
  key: string = "username";

  /**
   * #MIDATA -> array for the weight data
     store the raw data in this array.
   */

  //Global variable for work Occupation
  userType: string;

  items: any;

  //Form Validation
  isSubmitted: boolean = false;
  formGroup: FormGroup;

  constructor(
    private zone: NgZone,
    public navCtrl: NavController,
    private popoverCtrl: PopoverController,
    public navParams: NavParams,
    private storage: Storage,
    private midataService: MidataService,
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
    console.log('ionViewDidLoad MoreProfileAdaptionsPage');
  }

  presentPopover(myEvent) {
    let myPopoverData = {
      infoText: "Hier kannst du deine Profilangaben anpassen. " +
        "Der Benutzername wird nicht auf MIDATA gespeichert. Dein aktuelles Gewicht sowie deinen Wochenfortschritt für die Folgewoche kannst du wöchentlich via " +
        "Lokale-Benachrichtigung aktualisieren."
    }
    let popover = this.popoverCtrl.create(PopoverComponent, { data: myPopoverData });
    popover.present({
      ev: myEvent
    });
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

    // #MIDATA persistance: add Occupation
    let occupation = new MyResource(this.userType);
    let saveOccupation = this.midataService.save(occupation)
      .then((response) => {
        console.log("occupation saved", response);
      })
      .catch((error) => {
        console.error("Error in save request:", error);
      });

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
    //this.navCtrl.push(AdaptionsPage, {});
    this.navCtrl.popToRoot();
  }

}
