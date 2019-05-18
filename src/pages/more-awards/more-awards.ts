import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, Modal, ModalController, ModalOptions } from 'ionic-angular';

//component
import { PopoverComponent } from '../../components/popover/popover';

/**
 * Generated class for the MoreAwardsPage page.
 *
 * @author kochd1
 */

@IonicPage()
@Component({
  selector: 'page-more-awards',
  templateUrl: 'more-awards.html',
})
export class MoreAwardsPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MoreAwardsPage');
  }

  presentPopover(myEvent) {
    let myPopoverData = {
      infoText: "GradUp Auszeichnungen kannst du erhalten/sammeln, wenn du die Funktionalitäten von GradUp nutzt. " +
        "Tippe auf die entsprechende Auszeichnung, um zu schauen, was du machen musst, um die Auszeichnung zu erhalten."
    }
    let popover = this.popoverCtrl.create(PopoverComponent, { data: myPopoverData });
    popover.present({
      ev: myEvent
    });
  }

  openModal(awardType: string) {

    let customClass: string;

    if (awardType == 'Festgehalten') {
      customClass = 'setDownWrittenAward';
    }

    else if (awardType == 'Gedankenpower') {
      customClass = 'mentalPowerAward';
    }

    else {
      customClass = 'selfreflectorAward';
    }

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false, //user can only go back via close btn
      cssClass: customClass
    }

    let myModal: Modal;

    let myModalData = {
      awardType: awardType,
      isReceived: false
    }

    console.log("myModalData (data to pass to modal): ", myModalData); //as expected

    myModal = this.modalCtrl.create('ModalAwardsPage', { data: myModalData }, myModalOptions);

    myModal.present();

  }

}
