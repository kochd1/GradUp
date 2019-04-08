import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the StateOfMindPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StateOfMindPage');
  }

    /**
   * Adds subjective condition from user input to the resp. global variable.
   * @param value 
   */
  addSubjConditionInput(value: number){
    this.subjectiveCondition = value;
    this.moodChecked = true;
  }

  public gotoJournalPage() {
    this.navCtrl.popToRoot();

  }

}
