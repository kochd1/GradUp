import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

//import documentationEntry utility class
import { GoalEntry } from '../../classes/goalEntry';

/**
 * Generated class for the ModalGoalsPage page.
 *
 * @author kochd1
 *
 */

@IonicPage()
@Component({
  selector: 'page-modal-goals',
  templateUrl: 'modal-goals.html',
})
export class ModalGoalsPage {

  goalEntry: GoalEntry;

  goalEntryText: string;

  goalIsDaily: boolean;

  goalIsRepetitive: boolean;

  data: any;

  constructor(public navCtrl: NavController,
    private viewCtrl: ViewController,
    public navParams: NavParams) {

    //let newDate: Date = new Date();
    this.goalEntry = new GoalEntry(0, new Date(), "", false, false);

    console.log("goal modal constr() -> this.goalEntry", this.goalEntry);

    this.goalIsRepetitive = false;
  }

  ionViewWillLoad() {
    //data fetch was originally here before


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalGoalsPage');

    //data input from goals-management-page

    //get all data
    this.data = this.navParams.get('data');
    console.log("data from goals-management-page:", this.data);

    //filter goal entry
    this.goalEntry = this.data.goalEntry;
    console.log("goal entry data from goals-management-page", this.goalEntry);

    //filter boolean flag isDailyGoal
    this.goalIsDaily = this.data.isDailyGoal;
    console.log("goalIsDaily: ", this.goalIsDaily);

    //filter text from goal entry
    this.goalEntryText = this.goalEntry.entryText;
    console.log("text data filtered from goals-management-page", this.goalEntryText);

    //filter boolean flag isRepetitive from goal entry
    this.goalIsRepetitive = this.goalEntry.isRepetitive;
    console.log("boolean flag data isRepetitive filtered from goals-management-page", this.goalIsRepetitive);

  }


  /**
   * Modal dismissed the entry text to the respective class.
   */
  public setEntryText() {
    let entryData = {
      goalEntry: this.goalEntryText,
      repetitive: this.goalIsRepetitive
    }
    this.viewCtrl.dismiss(entryData);

    console.log("Modal setEntryText() -> this.goalEntryText", this.goalEntryText);
    console.log("Modal setEntryText() -> this.goalIsRepetitive", this.goalIsRepetitive);
    console.log("Modal setEntryText() -> entryData", entryData);

  }

  public closeModal() {

    this.viewCtrl.dismiss();
    /*const data = {
      name: 'John Doe',
      occupation: 'Milkman'
    };*/
  }

}
