import { Injectable } from '@angular/core';
import { Modal, ModalController, ModalOptions } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { t } from '@angular/core/src/render3';

@Injectable()
export class AwardService {

  awardType: string;
  writtenDownAwardRecieved: boolean;

  constructor(public modalCtrl: ModalController, private storage: Storage) {

    console.log("AwardService: constr() called");
    this.showAwardStatus();

  }

  showAwardStatus() {

    console.log("AwardService: showAwardStatus() called");

    console.log("Niedergeschrieben award status:", this.storage.get('Niedergeschrieben'));
    console.log("Gedankenpower award status:", this.storage.get('Gedankenpower'));
    console.log("Selbstreflekteur/in award status:", this.storage.get('Selbstreflekteur/in'));

  }

  /**
   * initialized the award progress (from app.component.ts -> platform.ready())
   */
  initializeAwardManagement() {

    console.log("initializeAwardManagement() called");

    this.storage.get('StartCount').then((value => {
      console.log("AwardService StartCount value: ", value);

      if (value == 1) {

        this.storage.set('Festgehalten', false);
        this.storage.set('Gedankenpower', false);
        this.storage.set('Selbstreflekteur/in', 0);

        console.log("initializeAwardManagement() -> initialized awards");

      }

    }));

  }


  checkAwardReceipt(awardType: string) {

    this.awardType = awardType;

    this.storage.get(awardType).then((value => {
      console.log("checkAwardReceipt(): this.storage.get() -> value", value);

      if (value == false) { //for the moment only suitable for the "true/false-awards"

        this.showAward();
      }
    }));
  }

  showAward() {

    let customClass: string;

    if (this.awardType == 'Festgehalten') {
      customClass = 'setDownWrittenAwardReceived';
    }

    else if (this.awardType == 'Gedankenpower') {
      customClass = 'mentalPowerAwardReceived';
    }

    else {
      customClass = 'selfreflectorAwardReceived';
    }

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false, //user can only go back via close btn
      cssClass: customClass
    }

    let myModal: Modal;

    let myModalData = {
      awardType: this.awardType,
      isReceived: true
    }

    console.log("myModalData (data to pass to modal): ", myModalData); //as expected

    myModal = this.modalCtrl.create('ModalAwardsPage', { data: myModalData }, myModalOptions);

    myModal.present();

    this.storage.set(this.awardType, true); //for the moment only suitable for the "true/false-awards"

  }


}
