import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, PopoverController } from 'ionic-angular';

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
    public popoverCtrl: PopoverController
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

  callBezugsperson(): void {
    this.storage.get("bezugsperson_telefonnummer").then(value => {
      console.log('callBezugsperson() : value:=', value);

      if (!value) {
        this.showNotPhonnumber();
        return;
      }

      this.callNumber.callNumber(value, true);
    });
  }

  showNotPhonnumber() {
    let alert = this.alertCtrl.create({
      title: "Sie haben im Onboarding-Prozess keine Telefonnummer erfasst",
      subTitle: "Sie können nun diese Nummer im Profil erfassen oder direkt dem Notfall (144) anrufen.",
      buttons: [
        {
          text: 'Profil',
          handler: () => {
            this.gotoCustomizeContacts()
          }
        },
        {
          text: '144',
          handler: () => {
            this.callNumber.callNumber("000", true);
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

  writeSMS(): void {
    this.storage.get("bezugsperson_smstext").then(text => {
      this.storage.get("bezugsperson_telefonnummer").then(telNr => {
        console.log('writeSMS() : text:=', text, ', telNr:=', telNr);

        if (!text) {
          this.showNotSMSText();
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
          })
          .catch((error) => {
            console.error(error);
          });
      });
    });
  }

  showNotSMSText() {
    let alert = this.alertCtrl.create({
      title: "Sie haben im Onboarding-Prozess keinen SMS-Text erfasst",
      subTitle: "Sie können nun diesen Text im Profil erfassen oder direkt dem Notfall (144) anrufen.",
      buttons: [
        {
          text: 'Profil',
          handler: () => {
            this.gotoCustomizeContacts()
          }
        },
        {
          text: '144',
          handler: () => {
            this.callNumber.callNumber("000", true);
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

  eMailBezugsperson(): void {
    this.storage.get("bezugsperson_email").then(mail => {
      this.storage.get("bezugsperson_emailtext").then(text => {
        console.log('eMailBezugsperson() : mail:=', mail, ',  text:=', text);

        if (!mail) {
          this.showNotMailAddress();
          return;
        }

        if (!text) {
          this.showNotMailText();
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

  showNotMailAddress() {
    let alert = this.alertCtrl.create({
      title: "Sie haben im Onboarding-Prozess keine E-Mail-Adresse erfasst",
      subTitle: "Sie können nun diese Adresse im Profil erfassen oder direkt dem Notfall (144) anrufen.",
      buttons: [
        {
          text: 'Profil',
          handler: () => {
            this.gotoCustomizeContacts()
          }
        },
        {
          text: '144',
          handler: () => {
            this.callNumber.callNumber("000", true);
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

  showNotMailText() {
    let alert = this.alertCtrl.create({
      title: "Sie haben im Onboarding-Prozess keinen Mail-Text erfasst",
      subTitle: "Sie können nun diesen Text im Profil erfassen oder direkt dem Notfall (144) anrufen.",
      buttons: [
        {
          text: 'Profil',
          handler: () => {
            this.gotoCustomizeContacts()
          }
        },
        {
          text: '144',
          handler: () => {
            this.callNumber.callNumber("000", true);
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

  callFachperson(): void {
    this.storage.get("fachperson_telefonnummer").then(value => {
      console.log('callFachperson() : value:=', value);
      if (!value) {
        this.showNotPhonnumber();
        return;
      }

      this.callNumber.callNumber(value, true);
    });
  }

  eMailFachperson(): void {
    this.storage.get("fachperson_email").then(mail => {
      this.storage.get("fachperson_emailtext").then(text => {
        console.log('eMailFachperson() : mail:=', mail, ',  text:=', text);

        if (!mail) {
          this.showNotMailAddress();
          return;
        }

        if (!text) {
          this.showNotMailText();
          return;
        }

        this.emailComposer.isAvailable().then((available: boolean) => {
          if (available) {
            //Now we know we can send
          }
        });

        let email = {
          to: mail,
          subject: 'Ich brauche Ihre Hilfe',
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
