import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, PopoverController, ToastController } from 'ionic-angular';

//modules
import { CallNumber } from '@ionic-native/call-number';
import { SMS } from '@ionic-native/sms';
import { EmailComposer } from '@ionic-native/email-composer';
import { Storage } from '@ionic/storage';

//components
import { PopoverComponent } from '../../components/popover/popover';

//pages
import { SupportSelfHelpPropositionsPage } from '../support-self-help-propositions/support-self-help-propositions';
import { SupportCopingStrategiesPage } from '../support-coping-strategies/support-coping-strategies';
import { MoreContactsAdaptionsPage } from '../more-contacts-adaptions/more-contacts-adaptions';


/**
 * Generated class for the SupportPage page.
 *
 * @author kochd1
 */

@IonicPage()
@Component({
  selector: 'page-support',
  templateUrl: 'support.html',
})
export class SupportPage {

  bezugsperson_telefonnummer: any;
  bezugsperson_smstext: string;
  bezugsperson_email: string;
  bezugsperson_emailtext: string;
  fachperson_telefonnummer: any;
  fachgperson_email: string;
  fachperson_emailtext: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public callNumber: CallNumber,
    private sms: SMS,
    private emailComposer: EmailComposer,
    private storage: Storage,
    private alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
    private toastCtrl: ToastController
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HelpPage');
  }

  presentPopover(myEvent) {
    let myPopoverData = {
      infoText: "Unter «Kontaktaufnahme» kannst du direkt mit deinen erfassten Personen (Bezugs- und Fachperson) via Telefon, SMS oder E-Mail in Kontakt treten."
        + " Bei «Selbsthilfe» kannst du dir einerseits Selbsthilfeangebote, welche verlinkt sind, anschauen. Weiter kannst du deine eigenen Bewältigungsstrategien hinzufügen."
    }
    let popover = this.popoverCtrl.create(PopoverComponent, { data: myPopoverData });
    popover.present({
      ev: myEvent
    });
  }

  /**
   * calls the reference person via Android call function.
   */
  callBezugsperson(): void {

    this.storage.get("bezugsperson_telefonnummer").then(value => {
      console.log('callBezugsperson() : value:=', value);

      if (!value) {

        this.showNoPhoneNumberAlert();
        return;
      }

      this.callNumber.callNumber(value, true);
    });
  }

  /**
   * Shows alert if there's no phone number.
   */
  showNoPhoneNumberAlert() {

    let alert = this.alertCtrl.create({
      title: "Du hast keine Telefonnummer hinterlegt.",
      subTitle: "Tippe unten auf «Kontakte», um die Telefonnummer nachzuerfassen. Du kannst dies auch später bei den Anpassungen/Einstellungen unter «Mehr» tun.",
      buttons: [
        {
          text: 'Kontakte',
          handler: () => {
            this.gotoCustomizeContacts();
          }
        },
        {
          text: 'Abbrechen',
          role: 'abbrechen',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    alert.present();
  }

  /**
   * sends a SMS via Android message function.
   */
  writeSMS(): void {
    this.storage.get("bezugsperson_smstext").then(text => {
      this.storage.get("bezugsperson_telefonnummer").then(telNr => {
        console.log('writeSMS() : text:=', text, ', telNr:=', telNr);

        let toastMessage: string = "";
        let toastDuration: number;

        if (!telNr) {
          this.showNoPhoneNumberAlert();
          return;
        }

        else if (!text) {
          this.showNoSMSTextAlert();
          return;
        }


        var options = {
          replaceLineBreaks: false, // true to replace \n by a new line, false by default
          android: {
            // send SMS with the native android SMS messaging
            // * intent: 'INTENT' => send SMS without open any other app
            // intent: '' => send directly, needs SEND_SMS permissions.
            intent: ''
          }
        };

        this.sms.send(telNr, text, options)
          .then(() => {
            console.log('sms sent successfully');
            toastMessage = "SMS erfolgreich gesendet";
            toastDuration = 3000;
            let toast = this.toastCtrl.create({
              message: toastMessage,
              duration: toastDuration,
              position: 'bottom',
              cssClass: 'toast' //not working at the moment
            });

            toast.onDidDismiss(() => {
              console.log('Dismissed toast');
            })

            toast.present();
          })
          .catch((error) => {
            console.error(error);
            toastMessage = "SMS konnte nicht gesendet werden. Versuche es erneut und prüfe allenfalls die Netzverbindung.";
            toastDuration = 5000;
            let toast = this.toastCtrl.create({
              message: toastMessage,
              duration: toastDuration,
              position: 'bottom',
              cssClass: 'toast' //not working at the moment
            });

            toast.onDidDismiss(() => {
              console.log('Dismissed toast');
            })

            toast.present();
          });
      });
    });
  }

  /**
   * Shows a alert if there's no SMS text.
   */
  showNoSMSTextAlert() {
    let alert = this.alertCtrl.create({
      title: "Du hast keinen SMS-Text vorerfasst.",
      subTitle: "Tippe unten auf «Kontakte», um den SMS-Text nachzuerfassen. Du kannst dies auch später bei den Anpassungen/Einstellungen unter «Mehr» tun.",
      buttons: [
        {
          text: 'Kontakte',
          handler: () => {
            this.gotoCustomizeContacts()
          }
        },
        {
          text: 'Abbrechen',
          role: 'abbrechen',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * opens eMail program and prepares draft
   */
  eMailBezugsperson(): void {
    this.storage.get("bezugsperson_email").then(mail => {
      this.storage.get("bezugsperson_emailtext").then(text => {
        console.log('eMailBezugsperson() : mail:=', mail, ',  text:=', text);

        if (!mail) {
          this.showNoMailAddressAlert();
          return;
        }

        if (!text) {
          this.showNoMailTextAlert();
          return;
        }

        this.emailComposer.isAvailable().then((available: boolean) => {
          if (available) {
            //Now we know we can send
          }
        });

        let email = {
          to: mail,
          subject: 'Ich brauche Deine Hilfe',
          body: text,
          isHtml: true
        };

        // Send a text message using default options
        this.emailComposer.open(email);

      });
    });
  }

  /**
   * Shows alert if there's no mail address.
   */
  showNoMailAddressAlert() {
    let alert = this.alertCtrl.create({
      title: "Du hast keine E-Mail-Adresse hinterlegt.",
      subTitle: "Tippe unten auf «Kontakte», um die E-Mail-Adresse nachzuerfassen. Du kannst dies auch später bei den Anpassungen/Einstellungen unter «Mehr» tun.",
      buttons: [
        {
          text: 'Kontakte',
          handler: () => {
            this.gotoCustomizeContacts()
          }
        },
        {
          text: 'Abbrechen',
          role: 'abbrechen',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * shows alert if there's no mail text.
   */
  showNoMailTextAlert() {
    let alert = this.alertCtrl.create({
      title: "Du hast keinen Mail-Text vorerfasst.",
      subTitle: "Tippe unten auf «Kontakte», um den Mail-Text nachzuerfassen. Du kannst dies auch später bei den Anpassungen/Einstellungen unter «Mehr» tun.",
      buttons: [
        {
          text: 'Kontakte',
          handler: () => {
            this.gotoCustomizeContacts()
          }
        },
        {
          text: 'Abbrechen',
          role: 'abbrechen',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * calls the specialist via Android call function.
   */
  callFachperson(): void {
    this.storage.get("fachperson_telefonnummer").then(value => {
      console.log('callFachperson() : value:=', value);
      if (!value) {
        this.showNoPhoneNumberAlert();
        return;
      }

      this.callNumber.callNumber(value, true);
    });
  }

  /**
   * opens eMail application to send one to the specialist.
   */
  eMailFachperson(): void {
    this.storage.get("fachperson_email").then(mail => {
      this.storage.get("fachperson_emailtext").then(text => {
        console.log('eMailFachperson() : mail:=', mail, ',  text:=', text);

        if (!mail) {
          this.showNoMailAddressAlert();
          return;
        }

        if (!text) {
          this.showNoMailTextAlert();
          return;
        }

        this.emailComposer.isAvailable().then((available: boolean) => {
          if (available) {
            //Now we know we can send
          }
        });

        let email = {
          to: mail,
          subject: 'Ich brauche Ihre Hilfe!',
          body: text,
          isHtml: true
        };

        // Send a text message using default options
        this.emailComposer.open(email);
      });
    });
  }

  public gotoSupportSelfHelpPropositionsPage() {
    this.navCtrl.push(SupportSelfHelpPropositionsPage);
  }

  public gotoSupportCopingStrategiesPage() {
    this.navCtrl.push(SupportCopingStrategiesPage, {});
  }

  public gotoCustomizeContacts() {
    // this would work, but do not know how to navigate to sub page
    // from outside. emit an event maybe?
    // var tabs = this.navCtrl.parent;
    // tabs.select(3);

    this.navCtrl.push(MoreContactsAdaptionsPage);
  }
}
