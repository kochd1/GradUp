import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Modal, ModalController, ModalOptions } from 'ionic-angular';
import { Storage } from '@ionic/storage';

//import goal entry utility class
import { GoalEntry } from '../../classes/goalEntry';

//import providers
import { GoalEntryDatabaseProvider } from '../../providers/database/goalEntryDB';

/**
 * Generated class for the GoalsManagementPage page.
 *
 * @author kochd1
 */

@IonicPage()
@Component({
  selector: 'page-goals-management',
  templateUrl: 'goals-management.html',
})
export class GoalsManagementPage {

  testData: any;

  goalEntry: GoalEntry;

  /**
   * stores the data input from the modal
   */
  inputData: string;

  /**
   * stores the data from the storage to edit via modal.
   */
  storageDataToEdit: string;

  /**
   * id of this goal entry.
   */
  goalEntryId: number;

  /**
   * collection of daily goal entries.
   */
  dailyGoalEntryCollection: GoalEntry[] = [];

  /**
   * boolean var to check, if above collection of daily goal entries is null.
   */
  dailyGoalEntryCollectionIsNull: boolean;

  /**
   * collection of open daily goal entries.
   */
  openDailyGoalEntryCollection: GoalEntry[] = [];

  /**
   * collection of all daily goals.
   */
  allDailyGoalEntriesCollection: GoalEntry[] = [];

  /**
   * collection of weekly goal entries.
   */
  weeklyGoalEntryCollection: GoalEntry[] = [];

  /**
   * boolean var to check, if above collection of weekly goal entries is null.
   */
  weeklyGoalEntryCollectionIsNull: boolean;

  /**
   * collection of open weekly goal entries.
   */
  openWeeklyGoalEntryCollection: GoalEntry[] = [];

  /**
   * collection of all weekly goal entries.
   */
  allWeeklyGoalEntryCollection: GoalEntry[] = [];

  /**
   * collection of archived goals.
   */
  goalEntryArchiveCollection: GoalEntry[] = [];

  /**
   * boolean variable for new entry
   */
  newEntry: boolean;

  /**
   * boolean var to check, if it's a daily goal.
   */
  isDailyGoal: boolean;

  /**
   * boolean var to check, if it's a weekly goal.
   */
  isWeeklyGoal: boolean;

  /**
   * boolean var to check, if it's a open goal.
   */
  isOpenGoal: boolean;

  /**
   * boolean var to check, if the respective goal is achieved.
   */
  isAchieved: boolean;

  /**
   * boolean var to check, if the respective goal is about to be edited.
   */
  aboutToEdit: boolean;

  /**
   * holds the id of the entry to be edited.
   */
  editId: number;

  /**
   * holds the original creation date of the goal.
   */
  editOrigEntryDate: Date;

  /**
   * holds the goal entry index.
   */
  entryIndex: number;

  //GUI
  isDataAvailable: boolean;
  goals: string;
  slidingItem;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private storage: Storage,
    public gEntryDbp: GoalEntryDatabaseProvider) {

    //let newDate: Date = new Date(); //new a string -> did not work
    this.goalEntry = new GoalEntry(0, new Date(), "", false);
    this.dailyGoalEntryCollectionIsNull = false;
    this.weeklyGoalEntryCollectionIsNull = false;

    this.newEntry = false;
    this.isDailyGoal = false;
    this.isWeeklyGoal = false;
    this.isOpenGoal = false;
    this.aboutToEdit = false;
    this.isAchieved = false;

    this.isDataAvailable = false;

  }

  ionViewCanEnter() {

    //this.documentationEntryCollection.push(this.testData);
    let that = this;
    //daily goal entry collection
    this.storage.get('dailyGoalEntryCollection').then((goalArray => {
      if (goalArray != null) {

        that.allDailyGoalEntriesCollection = goalArray;

        var today: Date = new Date();
        today.setHours(0, 0, 0, 0); //reset to midnight
        today.setDate(today.getDate());

        console.log("todayMidnight: ", today);

        let todayMidnightMs: number = today.getTime();
        console.log("todayMidnightMs: ", todayMidnightMs);

        that.dailyGoalEntryCollection = goalArray.filter(goal => goal.entryId >= todayMidnightMs);

        that.openDailyGoalEntryCollection = goalArray.filter(goal => goal.entryId < todayMidnightMs);

        this.goals = "dailyGoal"; //default view
        this.isDataAvailable = true;
        //this.goals = "dailyGoal"; //default view
      }

      else {
        that.dailyGoalEntryCollectionIsNull = true;
        this.goals = "dailyGoal"; //default view
        this.isDataAvailable = true; //anyway, because storage has been called
      }
      console.log("ionViewCanEnter() -> allDailyGoalEntriesCollection: ", that.allDailyGoalEntriesCollection);
      console.log("ionViewCanEnter() -> dailyGoalEntryCollection: ", that.dailyGoalEntryCollection);
      console.log("ionViewCanEnter() -> openDailyGoalEntryCollection: ", that.openDailyGoalEntryCollection);

    }));

    //weekly goal entry collection
    this.storage.get('weeklyGoalEntryCollection').then((goalArray => {
      if (goalArray != null) {
        that.allWeeklyGoalEntryCollection = goalArray;

        let today: Date = new Date();
        today.setHours(0, 0, 0, 0); //reset to midnight
        var currentDay = today.getDay();
        var deltaDay = currentDay - 1; //1= "monday"

        if (deltaDay == -1) { //if it's sunday
          deltaDay = 6;
        }

        //today.setDate(today.getDate() - 7); //a week ago
        //var aWeekAgo: string = today.toDateString();
        today.setDate(today.getDate() - deltaDay); //before last monday
        var lastMonday: Date = today; // last monday at midnight      .toDateString();
        var lastMondayMs = lastMonday.getTime(); //in ms
        that.openWeeklyGoalEntryCollection = goalArray.filter(goal => goal.entryId < lastMondayMs);
        that.weeklyGoalEntryCollection = goalArray.filter(goal => goal.entryId >= lastMondayMs);
      }

      else {
        that.weeklyGoalEntryCollectionIsNull = true;
      }

      console.log("ionViewCanEnter() -> allWeeklyGoalEntryCollection: ", that.allWeeklyGoalEntryCollection);
      console.log("ionViewCanEnter() -> weeklyGoalEntryCollection: ", that.weeklyGoalEntryCollection);
      console.log("ionViewCanEnter() -> openWeeklyGoalEntryCollection: ", that.openWeeklyGoalEntryCollection);

      console.log("currentDay ", currentDay);
      //console.log("aWeekago: ", aWeekAgo);
      console.log("lastMonday: ", lastMonday);
      console.log("lastMondayMs: ", lastMondayMs);

    }));

    //goal entry archive collection
    this.storage.get('goalEntryArchiveCollection').then((value => {
      if (value != null) {
        that.goalEntryArchiveCollection = value;
      }

      else {
        //that.weeklyGoalEntryCollectionIsNull = true;
      }
      console.log("ionViewCanEnter() -> goalArchiveEntryCollection: ", that.goalEntryArchiveCollection);

    }));

  }

  ionViewWillEnter() {

    console.log('ionViewWillEnter GoalsManagementPage');

    /*//this.documentationEntryCollection.push(this.testData);
    let that = this;
    //daily goal entry collection
    this.storage.get('dailyGoalEntryCollection').then((value => {
      if (value != null) {
        that.dailyGoalEntryCollection = value;
        this.isDataAvailable = true;
      }

      else {
        that.dailyGoalEntryCollectionIsNull = true;
      }
      console.log("ionViewDidLoad() -> dailyGoalEntryCollection: ", that.dailyGoalEntryCollection);

    }));

    //weekly goal entry collection
    this.storage.get('weeklyGoalEntryCollection').then((value => {
      if (value != null) {
        that.weeklyGoalEntryCollection = value;
      }

      else {
        that.weeklyGoalEntryCollectionIsNull = true;
      }
      console.log("ionViewDidLoad() -> weeklyGoalEntryCollection: ", that.weeklyGoalEntryCollection);

    }));

    //this.goals = "dailyGoal"; //default view*/
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad GoalsManagementPage');

    //this.goals = "dailyGoal"; //default view

  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

  /**
   * Sets the type of this entry via "add entry" button.
   */
  public setEntryType(entryType: string, isOpenGoal: boolean) {
    this.goalEntry = null; //reset goal entry (necessary, if an entry modification is aborted)
    this.aboutToEdit = false; //same reason

    console.log("setEntryType() called with value: ", entryType)
    if (entryType == 'dailyGoal') {
      this.isDailyGoal = true;
      console.log("setEntryType() -> this.isDailyGoal: ", this.isDailyGoal);
      this.isWeeklyGoal = false; //vice versa
    }

    else {
      this.isWeeklyGoal = true;
      console.log("setEntryType() -> this.isWeeklyGoal: ", this.isWeeklyGoal);
      this.isDailyGoal = false; //necessary, if user firstly want to enter a daily goal
    }

    this.isOpenGoal = isOpenGoal;
    console.log("setEntryType() -> this.isOpenGoal: ", this.isOpenGoal);
  }

  /**
   * opens the modal to add or to edit an entry.
   */
  public openModal() {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false, //user can only go back via close btn
    }

    let myModal: Modal;

    //only go through, if there's an entry to edit
    if (this.aboutToEdit == true) {

      let myModalData: GoalEntry = this.goalEntry;
      console.log("myModalData (data to pass to modal): ", myModalData); //as expected

      myModal = this.modalCtrl.create('ModalPage', { data: myModalData }, myModalOptions);
    }

    else {
      myModal = this.modalCtrl.create('ModalPage', myModalOptions);
    }

    myModal.present();

    let that = this;
    //let inputData: string;

    myModal.onDidDismiss((data) => {
      console.log("data from modal:", data);
      //that.documentationEntry.entryText = data;
      that.inputData = data;

      if (that.inputData) {
        that.newEntry = true;
      }
      console.log("modal onDidDismiss -> newEntry: ", that.newEntry);

      //console.log("documentationEntry.entryText after modal: ", this.documentationEntry.entryText); //undefined
      console.log("this.inputData after modal: ", this.inputData); //as expected

      if (data != null) {
        this.saveGoalEntry();
        console.log("openModal() -> saveGoalEntry() called");
      }

    });

  }

  /**
   * Add an entry to the list (saving is not handled here)
   * @deprecated
   */
  public addDocumentationEntry() {
    console.log("addDocumentationEntry() called");

    this.goalEntry.entryId = 1;
    //this.documentationEntry.entryDate= new Date();
    //this.documentationEntry.entryText='';

    console.log("goalEntry_temp: ", this.goalEntry);
    this.dailyGoalEntryCollection.push(this.goalEntry);
    this.newEntry = true;

  }

  /**
   * Aborts the entry input and splices the last unfinished/unsaved entry.
   * @deprecated
   */
  public abortEntryInput() {
    this.newEntry = false;
    this.dailyGoalEntryCollection.splice(this.dailyGoalEntryCollection.length - 1, 1);
  }

  /**
   * Saves the goal entry from the modal input.
   */
  public saveGoalEntry() {

    this.newEntry = true;

    let entryDate: Date;
    let entryId: number;

    console.log("saveGoalEntry() -> this.aboutToEdit: ", this.aboutToEdit);
    if (this.aboutToEdit == true) {
      entryId = this.editId;
      console.log("saveGoalEntry() -> entryId: ", entryId);
      entryDate = this.editOrigEntryDate;
      console.log("saveGoalEntry() -> entryDate: ", entryDate);
    }
    else {
      entryDate = new Date(); //date because of entryId
      entryId = Number(entryDate);
    }

    let entryText = this.inputData;

    this.goalEntry = new GoalEntry(entryId, entryDate, entryText, false); //"false" -> a new/edited goal is always not achieved.

    this.gEntryDbp.saveGoalEntry(this.goalEntry, this.isDailyGoal);

    if (this.aboutToEdit) {
      if (this.isDailyGoal) {
        if (!this.isOpenGoal) {

          this.dailyGoalEntryCollection.splice(this.entryIndex, 1);
        }

        else {
          this.openDailyGoalEntryCollection.splice(this.entryIndex, 1);
        }

      }

      else {
        if (!this.isOpenGoal) {
          this.weeklyGoalEntryCollection.splice(this.entryIndex, 1);
        }

        else {
          this.openWeeklyGoalEntryCollection.splice(this.entryIndex, 1);
        }

      }

    }

    console.log("saveGoalEntry() -> this.isOpenGoal", this.isOpenGoal);
    console.log("saveGoalEntry() -> this.isDailyGoal: ", this.isDailyGoal);
    console.log("saveGoalEntry() -> this.isWeeklyGoal: ", this.isWeeklyGoal);

    if (this.isDailyGoal) {
      if (!this.isOpenGoal) {
        this.dailyGoalEntryCollection.push(this.goalEntry);
        console.log("saveGoalEntry() -> this.dailyGoalEntryCollection was pushed.");
      }

      else {
        this.openDailyGoalEntryCollection.push(this.goalEntry);
        console.log("saveGoalEntry() -> this.openDailyGoalEntryCollection was pushed.");
      }

    }

    else {

      if (!this.isOpenGoal) {
        this.weeklyGoalEntryCollection.push(this.goalEntry);
        console.log("saveGoalEntry() -> this.weeklyGoalEntryCollection was pushed.");
      }

      else {
        this.openWeeklyGoalEntryCollection.push(this.goalEntry);
        console.log("saveGoalEntry() -> this.openWeeklyGoalEntryCollection was pushed.");
      }

    }

    console.log("saveGoalEntry() -> goalEntry", this.goalEntry);

    this.aboutToEdit = false; //necessary because of new entries without page reload

  }

  /**
 * Sets this goal "achieved".
 *
 * @param gEntryId - the id of this goal entry
 * @param index - the index of this goal entry
 */
  public setGoalEntryAchieved(gEntryId: number, index: number) {
    console.log("setGoalEntryAchieved() called");
    this.isAchieved = true;
    //this.editId = gEntryId;
    //this.entryIndex = index;

    //get element by id
    let that = this;

    this.goalEntry = that.goalEntry; //is not a solution

    this.gEntryDbp.getGoalEntryById(gEntryId, this.isDailyGoal).then((gEntry) => {

      that.goalEntry = gEntry;
      //documentationEntry = dEntry;
      console.log("setGoalEntry() -> text after storage access: ", that.goalEntry);

      this.archiveGoalEntry();

    });

  }

  /**
   * Archives this goal entry.
   */
  public archiveGoalEntry() {
    console.log("archiveGoalEntry() called")
    this.goalEntry.isAchieved = this.isAchieved;
    console.log("this.goalEntry: ", this.goalEntry);
    this.gEntryDbp.archiveGoalEntry(this.goalEntry);

  }

  /**
   * Creates/presents an instant feedback modal after the user has achieved a goal.
   */
  achievedGoal() {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false, //user can only go back via close btn
    }

    let modalInstantFeedback: Modal;

    let entryType = "goalEntry";

    modalInstantFeedback = this.modalCtrl.create('ModalCopingStrategyInstantFeedbackPage', { data: entryType }, myModalOptions);

    modalInstantFeedback.present();

  }

  /**
   * closes the sliding item for editing.
   *
   * @param slidingItem
   */
  public closeSlidingItem(slidingItem) {
    this.slidingItem = slidingItem;
    slidingItem.close();
  }

  /**
   * Gets the entry to edit and opens the modal.
   *
   * @param gEntryId - the id of this goal entry
   * @param index - the index of this goal entry
   */
  public editGoalEntry(gEntryId: number, gEntryDate: Date, index: number) {
    console.log("editGoalEntry() -> gEntryId: ", gEntryId);
    console.log("editGoalEntry() -> gEntryDate: ", gEntryDate);

    this.aboutToEdit = true;
    this.editId = gEntryId;
    this.editOrigEntryDate = gEntryDate;
    this.entryIndex = index;
    //get element by id
    let that = this;

    this.goalEntry = that.goalEntry; //is not a solution

    this.gEntryDbp.getGoalEntryById(gEntryId, this.isDailyGoal).then((gEntry) => {

      that.goalEntry = gEntry;
      //documentationEntry = dEntry;
      console.log("editGoalEntry() -> text after storage access: ", that.goalEntry);

      this.openModal(); //must be called here, otherwise the value of dEntry can't be passed to the modal!
      this.closeSlidingItem(this.slidingItem); //closes after the edit btn was fired
    });

  }

  /**
   * deletes the respective goal entry.
   *
   * @param gEntryId - the id of the entry
   * @param index - the index of the entry (relevant for the data presentation)
   */
  public deleteGoalEntry(gEntryId: number, index: number, isOpenGoalEntry: boolean) { //vorher (item)
    console.log("deleteEntry() called");

    this.goalEntryId = gEntryId;

    let opengEntry: boolean = isOpenGoalEntry;

    console.log("goalEntryDelete -> goalEntryId (local param): " + gEntryId);
    console.log("goalEntryDelete -> goalEntryId (instance variable): " + this.goalEntryId);

    console.log("deleteGoalEntry (logic)-> this.isDailyGoal before DB: ", this.isDailyGoal);

    this.gEntryDbp.deleteGoalEntry(gEntryId, this.isDailyGoal); //db processing

    if (this.isDailyGoal) {

      if (!opengEntry) {
        this.dailyGoalEntryCollection.splice(index, 1);
      }

      else {
        this.openDailyGoalEntryCollection.splice(index, 1);
      }

    }

    else {

      if (!opengEntry) {
        this.weeklyGoalEntryCollection.splice(index, 1);
      }

      else {
        this.openWeeklyGoalEntryCollection.splice(index, 1);
      }

    }

  }

}
