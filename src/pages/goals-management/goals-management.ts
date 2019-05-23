import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, PopoverController, Modal, ModalController, ModalOptions } from 'ionic-angular';
import { Storage } from '@ionic/storage';

//component
import { PopoverComponent } from '../../components/popover/popover';

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
   * stores the goal entry text data input from the modal
   */
  inputEntryTextData: string;

  /**
   * stores the goal entry check-box data input from the modal.
   */
  inputGoalIsRepetitive: boolean;

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
   * boolean var to check, if it's a repetitive daily goal.
   */
  isRepetitive: boolean;

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
   * holds the original text of the goal.
   */
  editOrigEntryText: string;

  /**
   * holds the original text of the goal.
   */
  editOrigIsRepetitive: boolean;

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
    public popoverCtrl: PopoverController,
    private modalCtrl: ModalController,
    private storage: Storage,
    public gEntryDbp: GoalEntryDatabaseProvider) {

    //let newDate: Date = new Date(); //new a string -> did not work
    this.goalEntry = new GoalEntry(0, new Date(), "", false, false);
    this.dailyGoalEntryCollectionIsNull = false;
    this.weeklyGoalEntryCollectionIsNull = false;

    this.newEntry = false;
    this.isDailyGoal = false;
    this.isWeeklyGoal = false;
    this.isOpenGoal = false;
    this.aboutToEdit = false;
    this.isAchieved = false;

    this.isDataAvailable = false;

    //this.goals = "dailyGoal"; // !!loading and presenting problems when user has to login at the beginning.!!

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

        console.log("lastMidnight: ", today);

        let lastMidnightMs: number = today.getTime();
        console.log("lastMidnightMs: ", lastMidnightMs);

        var nextMidnight: Date = new Date();
        nextMidnight.setHours(23, 59, 59, 999);
        nextMidnight.setDate(today.getDate());

        var nextMidnightMs = nextMidnight.getTime();

        that.dailyGoalEntryCollection = goalArray.filter(goal => goal.entryId >= lastMidnightMs && goal.entryId <= nextMidnightMs);

        that.openDailyGoalEntryCollection = goalArray.filter(goal => goal.entryId < lastMidnightMs);

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

      console.log("nextMidnightMs", nextMidnightMs)

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
        var lastMondayMidnight: Date = today; // last monday at midnight      .toDateString();
        var lastMondayMidnightMs = lastMondayMidnight.getTime(); //in ms
        that.openWeeklyGoalEntryCollection = goalArray.filter(goal => goal.entryId < lastMondayMidnightMs);
        that.weeklyGoalEntryCollection = goalArray.filter(goal => goal.entryId >= lastMondayMidnightMs);
      }

      else {
        that.weeklyGoalEntryCollectionIsNull = true;
      }

      console.log("ionViewCanEnter() -> allWeeklyGoalEntryCollection: ", that.allWeeklyGoalEntryCollection);
      console.log("ionViewCanEnter() -> weeklyGoalEntryCollection: ", that.weeklyGoalEntryCollection);
      console.log("ionViewCanEnter() -> openWeeklyGoalEntryCollection: ", that.openWeeklyGoalEntryCollection);

      console.log("currentDay ", currentDay);
      //console.log("aWeekago: ", aWeekAgo);
      console.log("lastMonday: ", lastMondayMidnight);
      console.log("lastMondayMs: ", lastMondayMidnightMs);

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

    }));*/

    //this.goals = "dailyGoal"; //!!test default view -> does not work!!
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad GoalsManagementPage');

    //this.goals = "dailyGoal"; // does not work! default view

  }

  presentPopover(myEvent) {
    let myPopoverData = {
      infoText: "Hier kannst du deine Tages- und Wochenziele verwalten, die du entweder selber für dich definierst oder in deiner Therapie festlegst. Noch offene Ziele - d. h. Ziele, die nicht am selben Tag oder nicht in derselben Woche, wo du sie erfasst hast, erreicht wurden, erscheinen separat mit einer roten Checkbox."
        + " Du kannst die Ziele jederzeit ansehen, bearbeiten und löschen."
    }
    let popover = this.popoverCtrl.create(PopoverComponent, { data: myPopoverData });
    popover.present({
      ev: myEvent
    });
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

  /**
   * Sets the type of this entry via "add entry" button.
   */
  public setEntryType(entryType: string, isOpenGoal: boolean, isRepetitive: boolean) {
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

    this.isRepetitive = isRepetitive;

  }

  /**
   * opens the modal to add or to edit an entry.
   */
  public openModal() {

    let customClass: string;
    if (this.isDailyGoal) {
      customClass = 'dailyGoalEntry';
    }

    else {
      customClass = 'weeklyGoalEntry'
    }

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false, //user can only go back via close btn
      cssClass: customClass
    }

    let myModal: Modal;

    //only go through, if there's an entry to edit
    //if (this.aboutToEdit == true) {

    //let myModalData: GoalEntry = this.goalEntry;

    const myModalData = {
      goalEntry: this.goalEntry,
      isDailyGoal: this.isDailyGoal
    };

    console.log("myModalData (data to pass to modal): ", myModalData); //as expected

    myModal = this.modalCtrl.create('ModalGoalsPage', { data: myModalData }, myModalOptions);
    //}

    /*else {
      myModal = this.modalCtrl.create('ModalGoalsPage', myModalOptions);
    }*/

    myModal.present();

    let that = this;
    myModal.onDidDismiss((data) => {
      console.log("data from modal:", data);

      that.inputEntryTextData = data.goalEntry;
      that.inputGoalIsRepetitive = data.repetitive;

      if (that.inputEntryTextData) {
        that.newEntry = true;
      }
      console.log("modal onDidDismiss -> newEntry: ", that.newEntry);

      console.log("this.inputEntryTextData after modal: ", this.inputEntryTextData);
      console.log("this.inputGoalIsRepetitive after modal: ", this.inputGoalIsRepetitive);

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
    let entryText: string;
    let isRepetitive: boolean;

    console.log("saveGoalEntry() -> this.aboutToEdit: ", this.aboutToEdit);
    if (this.aboutToEdit == true) {
      entryId = this.editId;
      console.log("saveGoalEntry() -> entryId: ", entryId);
      entryDate = this.editOrigEntryDate;
      console.log("saveGoalEntry() -> entryDate: ", entryDate);
      entryText = this.inputEntryTextData;
      isRepetitive = this.inputGoalIsRepetitive;
    }

    else if (this.isRepetitive) {
      console.log("saveGoalEntry() -> this.isRepetitive: ", this.isRepetitive);
      console.log("this.editId (before adding ms)", this.editId);

      let now = new Date();
      let nowMs = now.getTime() //get current ms count
      console.log("nowMs: ", nowMs);
      let timeDiffMs = nowMs - this.editId; //calculate a time difference in ms between the creation date and now
      console.log("timeDiffMs: ", timeDiffMs);
      entryId = this.editId + timeDiffMs + 86400000; //add this time difference to the id and set Id to 24h in ms from now on
      //-> adding the time difference ensures, that a still-open-goal, which is open more than 24h, is shown correctly.
      console.log("saveGoalEntry() -> entryId: ", entryId);
      entryDate = this.editOrigEntryDate;
      console.log("saveGoalEntry() -> entryDate: ", entryDate);
      entryText = this.editOrigEntryText;
      isRepetitive = this.editOrigIsRepetitive;
    }

    else {
      entryDate = new Date(); //date because of entryId
      entryId = Number(entryDate);
      entryText = this.inputEntryTextData;
      isRepetitive = this.inputGoalIsRepetitive;
    }

    this.goalEntry = new GoalEntry(entryId, entryDate, entryText, isRepetitive, false); //"false" -> a new/edited goal is always not achieved.

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
    if (!this.isRepetitive) {

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

    }

    else {
      //do nothing
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
  showInstantFeedbackGoalAchieved() {

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
    console.log("editGoalEntry() called");

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
      console.log("editGoalEntry() -> text after storage access: ", that.goalEntry);

      this.openModal(); //must be called here, otherwise the value of dEntry can't be passed to the modal!
      this.closeSlidingItem(this.slidingItem); //closes after the edit btn was fired
    });

  }

  /**
   * handles a repetitive goal after achieving one.
   *
   * @param gEntryId - the goal entry id
   * @param gEntryDate - the goal entry date
   * @param gEntryText - the goal entry text
   * @param isRepetitive - the boolean flag for a repetive goal
   * @param index - the index of this goal entry
   */
  public handleRepetitiveGoalEntry(gEntryId: number, gEntryDate: Date, gEntryText: string, isRepetitive: boolean, index: number) {
    console.log("handleRepetitiveGoalEntry() called");

    console.log("handleRepetitiveGoalEntry() -> gEntryId: ", gEntryId);
    console.log("handleRepetitiveGoalEntry() -> gEntryDate: ", gEntryDate);

    this.isRepetitive = isRepetitive;

    if (isRepetitive) {
      this.editId = gEntryId;
      this.editOrigEntryDate = gEntryDate;
      this.entryIndex = index;
      this.editOrigEntryText = gEntryText;
      this.editOrigIsRepetitive = isRepetitive;
      //get element by id
      let that = this;

      this.goalEntry = that.goalEntry; //is not a solution

      this.gEntryDbp.getGoalEntryById(gEntryId, this.isDailyGoal).then((gEntry) => {

        that.goalEntry = gEntry;
        //documentationEntry = dEntry;
        console.log("handleGoalEntry() -> text after storage access: ", that.goalEntry);
        this.saveGoalEntry();
      });

    }

    else {
      //do nothing
    }

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
