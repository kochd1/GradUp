import { Injectable } from '@angular/core';
import { App } from 'ionic-angular';
import { LocalNotifications, ILocalNotification, ELocalNotificationTriggerUnit, ILocalNotificationTrigger } from '@ionic-native/local-notifications';
import { WeightReminderNotificationPage } from '../pages/weight-reminder-notification/weight-reminder-notification';
import { Storage } from '@ionic/storage';
import { StateOfMindPage } from '../pages/state-of-mind/state-of-mind';
import { ViewController } from 'ionic-angular/navigation/view-controller';

@Injectable()
export class NotificationService {

  constructor(
    private appCtrl: App,
    //public viewCtrl: ViewController,
    private localNotifications: LocalNotifications,
    private storage: Storage,
  ) {

    // Register click event listener for each local notification
    // For the time being, this only works if the application is already open.
    // Should be corrected after the prototype phase.
    var observable = this.localNotifications.on('click');
    observable.subscribe(
      notification => {
        if (notification.data == 'TEST') {
          //alert('Is test notification.');
          this.appCtrl.getActiveNav().setRoot(WeightReminderNotificationPage);
        }
        if (notification.data == 'ENTER_WEIGHT') {
          //alert('Todo redirect to enter weight page.');
          this.appCtrl.getActiveNav().push(WeightReminderNotificationPage);
        }

        if (notification.data == 'ENTER_MOOD') {
          //alert('Todo redirect to mood enter page.');
          this.appCtrl.getActiveNav().push(StateOfMindPage); //local-notification arrives, does open the page but page has refresh errors.
          //this.appCtrl.getActiveNav().setRoot(StateOfMindPage); //push-notification arrives, does open the page but page is corrupt
          //this.navCtrl.push(StateOfMindPage) //doesn't work, journal page can't be loaded
          //this.viewCtrl.dismiss(); //new -> doesn't work
          //this.app.getRootNav().push(StateOfMindPage); //push-notification doesn't arrive.

        }
      },
      (error) => {
        alert(error);
      },
      () => {
        //complete
      }
    );
  }

  public schedule(options: ILocalNotification): any {
    console.log('schedule() : options:=', options);

    this.localNotifications.requestPermission().then((permission) => {
      this.storage.get("username").then(userName => {
        var s = options.text as string
        if (s) {
          options.text = s.replace('{{UserName}}', userName);
        }

        this.localNotifications.schedule(options);
      });

    }).catch(error => {
      alert('no permission' + error);
    });
  }

  public createTestNotification() { //does not work!
    let time = new Date();
    time.setHours(15, 40, 0, 0); //works only one time

    console.log("time: ", time);

    let notification: any = {
      text: 'Hallo {{UserName}}, wie fühlst du dich nach diesem Tag? Klicke auf diese Push-Nachricht, um deinen Gemütszustand rückblickend auf den Tag anzugeben.',
      trigger: {
        firstAt: new Date(time),
        every: {
          minute: 1
        },
        //count: 1
        //every: ELocalNotificationTriggerUnit.SECOND,
        //count: 10
      }, //{ at: new Date(new Date().getTime() + 3600) },

      led: 'FF0000',
      sound: null,
      data: 'ENTER_MOOD'

    };

    console.log("notification: ", notification);
    this.schedule(notification);
    console.log("scheduled or not: ", this.localNotifications.isScheduled);
  }



  /**
   * The user receives daily a push-notification, in which the user can declerate his current mood plus the reason for it.
   */
  public createDailyMoodDeclerationNotification() {
    // First notification at 8pm, repeating daily

    let time = new Date();
    time.setHours(20, 0, 0, 0); //works everyday, at least when the app was used during the day.

    console.log("time: ", time);

    this.schedule({
      text: 'Hallo {{UserName}}, wie fühlst du dich nach diesem Tag? Tippe auf diese Nachricht, um GradUp zu öffnen und deinen Gemütszustand rückblickend auf den Tag anzugeben.',
      trigger: {
        at: new Date(time),

        /*every: {
          minute: 1
        },
        count: 1*/
        //every: ELocalNotificationTriggerUnit.SECOND,
        //count: 10
      }, //{ at: new Date(new Date().getTime() + 3600) },

      led: 'FF0000',
      sound: null,
      data: 'ENTER_MOOD'

    });
  }

  /**
   * Once per week the user receives a push-notification, in which the user can enter his/her new weight
   * and also new weight gain for the following week.
   */
  public createWeeklyWeightNotification() {
    // First notification in 7 days, repeating each week
    let trigger: ILocalNotificationTrigger = {
      every: ELocalNotificationTriggerUnit.WEEK
    };

    // for testing reduced interval to 45 seconds
    /*trigger = {
      every: ELocalNotificationTriggerUnit.SECOND,
      count: 45
    };*/

    this.schedule({
      text: `Hallo {{UserName}}, es sind schon wieder 7 Tage vergangen. Tippe auf diese Nachricht, um dein aktuelles Gewicht und deinen neuen Wochenfortschritt einzugeben.`,
      trigger: trigger,
      data: 'ENTER_WEIGHT'
    });
  }

  showNegativeHeartRate() {
    let at = new Date(new Date().getTime() + 1000);
    console.log("showNegativeHeartRate() : at:=", at);

    /*this.schedule({
      text: `Hallo {{UserName}}, achte bitte besser auf Dich und Deine Gesundheit. Verzichte bitte auf körperliche Anstrengungen.`,
      trigger: {
        at: at
      }
    });*/
  }

  showPositiveHeartRate(): any {
    let at = new Date(new Date().getTime() + 1000);
    console.log("showPositiveHeartRate() : at:=", at);

    /*this.schedule({
      text: `Hallo {{UserName}}, Du befindest Dich aktuell vermutlich in einer Stresssituation. Versuche ganz ruhig zu atmen.`,
      trigger: {
        at: at
      }
    });*/
  }
}
