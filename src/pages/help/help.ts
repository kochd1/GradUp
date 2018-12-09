import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HelpPointsofcontactPage } from '../help-pointsofcontact/help-pointsofcontact';
import { HelpCopingPage } from '../help-coping/help-coping';
import { HelpRelaxationPage } from '../help-relaxation/help-relaxation';
import { CallNumber } from '@ionic-native/call-number';
import { SMS } from '@ionic-native/sms';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the HelpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {

  [x: string]: any;
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
    private storage: Storage
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HelpPage');
  }

  callBezugsperson(): void {
    this.storage.get("bezugsperson_telefonnummer").then(value => {
      console.log('callBezugsperson() : value:=', value);
      this.callNumber.callNumber(value, true);
    });
  }

  writeSMS(): void {
    this.storage.get("bezugsperson_smstext").then(text => {
      this.storage.get("bezugsperson_telefonnummer").then(telNr => {
        console.log('writeSMS() : text:=', text, ', telNr:=', telNr);

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

  callFachperson(): void {
    this.storage.get("fachperson_telefonnummer").then(value => {
      console.log('callFachperson() : value:=', value);
      this.callNumber.callNumber(value, true);
    });
  }

  public gotoHelpPointsofcontactPage() {
    this.navCtrl.push(HelpPointsofcontactPage, {});
  }

  public gotoHelpCopingPage() {
    this.navCtrl.push(HelpCopingPage, {});
  }

  public gotoHelpRelaxationPage() {
    this.navCtrl.push(HelpRelaxationPage, {});
  }
}
