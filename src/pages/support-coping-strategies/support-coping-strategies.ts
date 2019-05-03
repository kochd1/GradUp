import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Modal, ModalController, ModalOptions } from 'ionic-angular';
import { Storage } from '@ionic/storage';

//import documentationEntry utility class
import { DocumentationEntry } from '../../classes/documentationEntry';

//import providers
import { CopingStrategyEntryDatabaseProvider } from '../../providers/database/copingStrategyEntryDB';
import { SupportPage } from "../support/support";

@IonicPage()
@Component({
  selector: 'page-support-coping-strategies',
  templateUrl: 'support-coping-strategies.html',
})
export class SupportCopingStrategiesPage {


  copingStrategyEntry: DocumentationEntry;

  /**
   * stores the data input from the modal
   */
  inputData: string;

  /**
   * stores the data from the storage to edit via modal.
   */
  storageDataToEdit: string;

  /**
   * id of this coping strategy entry.
   */
  copingStrategyEntryId: number;

  /**
   * collection of coping strategy entries.
   */
  copingStrategyEntryCollection: DocumentationEntry[] = [];

  copingStrategyEntryCollectionIsNull: boolean;

  /**
   * boolean variable for new entry
   */
  newEntry: boolean;

  aboutToEdit: boolean;

  editId: number;

  entryIndex: number;

  slidingItem;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private storage: Storage,
    public csEntryDbp: CopingStrategyEntryDatabaseProvider) {

    let newDate: Date = new Date();
    this.copingStrategyEntry = new DocumentationEntry(0, newDate, "");
    this.copingStrategyEntryCollectionIsNull = false;

    this.newEntry = false;
    this.aboutToEdit = false;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SupportCopingStrategiesPage');


    //this.documentationEntryCollection.push(this.testData);
    let that = this;
    //fear documentation entry collection
    this.storage.get('copingStrategyEntryCollection').then((value => {
      if (value != null) {
        that.copingStrategyEntryCollection = value;
      }

      else {
        that.copingStrategyEntryCollectionIsNull = true;
      }
      console.log("ionViewDidLoad() -> copingStrategyEntryCollection: ", that.copingStrategyEntryCollection);

    }));
  }

  /**
   * Creates/presents an instant feedback modal after the user has confirmed a performed coping strategy.
   */
  performedCopingStrategy() {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false, //user can only go back via close btn
    }

    let modalInstantFeedback: Modal;

    let entryType = "copingStrategyEntry";

    modalInstantFeedback = this.modalCtrl.create('ModalCopingStrategyInstantFeedbackPage', { data: entryType }, myModalOptions);

    modalInstantFeedback.present();

  }

  /**
   * resets the "copingStrategyEntry" and the "aboutToEdit" variable (necessary, if an entry modification is being aborted
   * and a new one is being created instead.) This method will be executed everytime the "add entry" button is being pushed.
   */
  public resetCopingStrategyEntry() {

    this.copingStrategyEntry = null;
    this.aboutToEdit = false;

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

      let myModalData: DocumentationEntry = this.copingStrategyEntry;
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

      that.inputData = data;

      if (that.inputData) {
        that.newEntry = true;
      }
      console.log("modal onDidDismiss -> newEntry: ", that.newEntry);

      console.log("this.inputData after modal: ", this.inputData); //as expected

      if (data != null) {
        this.saveCopingStrategyEntry();
        console.log("savecopingStrategyEntry() called")
      }

    });

  }

  /**
   * Aborts the entry input and splices the last unfinished/unsaved entry.
   * @deprecated
   */
  public abortEntryInput() {
    this.newEntry = false;
    this.copingStrategyEntryCollection.splice(this.copingStrategyEntryCollection.length - 1, 1);
  }

  /**
   * Saves the coping strategy entry from the modal input.
   */
  public saveCopingStrategyEntry() {
    this.newEntry = true;

    let entryDate = new Date();
    let entryId;
    if (this.aboutToEdit == true) {
      entryId = this.editId;
    }
    else {
      entryId = Number(entryDate);
    }

    let entryText = this.inputData;

    this.copingStrategyEntry = new DocumentationEntry(entryId, entryDate, entryText);

    this.csEntryDbp.saveCopingStrategyEntry(this.copingStrategyEntry);

    if (this.aboutToEdit) {

      this.copingStrategyEntryCollection.splice(this.entryIndex, 1);
    }


    this.copingStrategyEntryCollection.push(this.copingStrategyEntry);
    console.log("this.copingStrategyEntryCollection was pushed.");



    console.log("savecopingStrategyEntry() -> copingStrategyEntry", this.copingStrategyEntry);

    this.aboutToEdit = false; //necessary because of new entries without page reload

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
   * @param csEntryId
   * @param index
   */
  public editCopingStrategyEntry(csEntryId: number, index: number) {
    console.log("editcopingStrategyEntry() -> csEntryId: ", csEntryId); //as expected
    this.aboutToEdit = true;
    this.editId = csEntryId;
    this.entryIndex = index;
    //get element by id
    let that = this;

    this.copingStrategyEntry = that.copingStrategyEntry; //is not a solution

    this.csEntryDbp.getCopingStrategyEntryById(csEntryId).then((csEntry) => {

      that.copingStrategyEntry = csEntry;
      console.log("editcopingStrategyEntry() -> text after storage access: ", that.copingStrategyEntry);

      this.openModal(); //must be called here, otherwise the value of dEntry can't be passed to the modal!
      this.closeSlidingItem(this.slidingItem); //closes after the edit btn was fired
    });

  }

  /**
   * deletes the respective coping strategy entry.
   *
   * @param csEntryId - the id of the entry
   * @param index - the index of the entry (relevant for the data presentation)
   */
  public deleteCopingStrategyEntry(csEntryId: number, index: number) { //vorher (item)
    console.log("deleteEntry() called");

    this.copingStrategyEntryId = csEntryId;

    console.log("copingStrategyEntryDelete -> copingStrategyEntryId (local param): " + csEntryId);
    console.log("copingStrategyEntryDelete -> copingStrategyEntryId (instance variable): " + this.copingStrategyEntryId);


    this.csEntryDbp.deleteCopingStrategyEntry(csEntryId); //db processing

    this.copingStrategyEntryCollection.splice(index, 1);

  }

  public gotoSupportPage() {
    //this.navCtrl.push(HelpPage, {});
    this.navCtrl.popToRoot();
  }

}
