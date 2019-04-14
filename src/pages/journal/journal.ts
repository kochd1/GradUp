import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { JournalEntryFormPage } from '../journal-entry-form/journal-entry-form';
import { JournalEntryListPage } from '../journal-entry-list/journal-entry-list';
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
    //this.scheduleNotification();
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave JournalPage');
  }

  public gotoJournalEntryPage() {
    this.navCtrl.push(JournalEntryFormPage, {});
  }

  public gotoJournalDeletePage() {
    this.navCtrl.push(JournalEntryListPage, {});
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