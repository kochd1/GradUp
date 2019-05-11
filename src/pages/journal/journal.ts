import { Component } from '@angular/core';
import { NavController, PopoverController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

//component
import { PopoverComponent } from '../../components/popover/popover';

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
    public popoverCtrl: PopoverController,
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

  presentPopover(myEvent) {
    let myPopoverData = {
      infoText: "In deinem Tagebuch kannst du deine Erlebnisse schriftlich festhalten und sie mit einem Foto ergänzen. Zudem kannst du - gleich im Tagebuch oder auch separat - deinen aktuellen Gemütszustand erfassen."
    }
    let popover = this.popoverCtrl.create(PopoverComponent, { data: myPopoverData });
    popover.present({
      ev: myEvent
    });
  }

  public gotoJournalEntryPage() {
    this.navCtrl.push(JournalEntryFormPage, {});
  }

  public gotoJournalDeletePage() {
    this.navCtrl.push(JournalEntryListPage, {});
  }

  public gotoStateOfMindPage() {
    this.navCtrl.push(StateOfMindPage, {});
  }


  public gotoWeightReminderPage() {
    this.navCtrl.push(WeightReminderNotificationPage, {});
  }

  public scheduleNotification() {
    this.notificationService.createDailyMoodDeclerationNotification();
    //this.notificationService.createWeeklyWeightNotification();
    //this.pulseStepsService.schedule();
  }
}
