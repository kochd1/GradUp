import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { NotificationService } from '../../services/notification.service';

//MIDATA imports
import { MidataService } from '../../services/MidataService';
import { ObsMentalCondition } from '../../resources/subjectiveCondition';

//JournalPage
import { JournalPage } from '../journal/journal';

/**
 * Generated class for the StateOfMindPage page.
  @author kochd1
 */

@IonicPage()
@Component({
  selector: 'page-state-of-mind',
  templateUrl: 'state-of-mind.html',
})
export class StateOfMindPage {

    /**
   * variable which stores the user input concerning the subj. condition.
   */
  subjectiveCondition: number;

  /**
   * stores the reason for the current mood of the user.
   */
  moodReason: string;


  moodChecked:boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private notificationService: NotificationService, 
              private midataService: MidataService,
              private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StateOfMindPage');
    this.scheduleNotification();
  }

    /**
   * Adds subjective condition from user input to the resp. global variable.
   * @param value 
   */
  public addSubjConditionInput(value: number){
    this.subjectiveCondition = value;
    this.moodChecked = true;
  }

  /**
   * Saves the mood entry to MIDATA
   */
  public saveMoodEntry(){
    console.log("saveMoodEntry() -> subjectiveCondition:", this.subjectiveCondition);

      //input filter (additional)
      if(this.subjectiveCondition==0 || this.subjectiveCondition==1 || this.subjectiveCondition==2){

        console.log("saveMoodEntry() -> subjective condition input: ", this.subjectiveCondition);
        console.log("saveMoodEntry() -> mood reason: ", this.moodReason);

        let moodReason: string;

        if(this.moodReason)
        {
          moodReason = this.moodReason;
        }

        else{
          moodReason = "N/A" //so that if it is null, it is shown something useful on MIDATA
        }
      
        let mentalCondition = new ObsMentalCondition(this.subjectiveCondition, moodReason);

        this.midataService.save(mentalCondition)
        .then((response) => {
          // we can now access the midata response
          console.log("ObsMentalCondition fired on MIDATA");
        
    
        }).catch((error) => {
            console.error("Error in save request:", error);
        });

        console.log("mental condition: ", mentalCondition);
        }

        this.showInstantFeedback();
  }

  showInstantFeedback(){
    let alert = this.alertCtrl.create({
      title: '',
      subTitle: 'Schön, dass du deine Stimmung angegeben hast :)',
      cssClass: 'alert-button-inner',
      buttons: [
        {
          text: 'Weiter',
          handler: () =>{
          this.navCtrl.popToRoot();
        }
      }
  ]
});

alert.present();
  
  }

  public gotoJournalPage() {
    this.navCtrl.popToRoot();

  }

  public scheduleNotification() {
    this.notificationService.createDailyMoodDeclerationNotification();
  }

}
