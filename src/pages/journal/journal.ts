import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { JournalEntryPage } from '../journal-entry/journal-entry';
import { JournalDeletePage } from '../journal-delete/journal-delete';
import { StateOfMindPage } from '../state-of-mind/state-of-mind';

import { NotificationService } from '../../services/notification.service';
import { WeightReminderNotificationPage } from '../weight-reminder-notification/weight-reminder-notification';
import { PulseStepsService } from '../../services/pulse-steps.service';
import { WelcomePage } from '../welcome/welcome';

@Component({
  selector: 'page-journal',
  templateUrl: 'journal.html'
})
export class JournalPage {

  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    private notificationService: NotificationService
    //private pulseStepsService: PulseStepsService,
  ) { 

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JournalPage');
    this.scheduleNotification();
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave JournalPage');
  }

  public gotoJournalEntryPage() {
    this.navCtrl.push(JournalEntryPage, {});
  }

  public gotoJournalDeletePage() {
    this.navCtrl.push(JournalDeletePage, {});
  }

  public gotoStateOfMindPage(){
    this.navCtrl.push(StateOfMindPage, {});
  }


  public gotoWeightReminderPage() {
    this.navCtrl.push(WeightReminderNotificationPage, {});
  }

  public scheduleNotification() {
    this.notificationService.createWeeklyWeightNotification();
    //this.pulseStepsService.schedule();
  }
}