import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Modal, ModalController, ModalOptions } from 'ionic-angular';
import { InformationDocumentationPage } from '../information-documentation/information-documentation';
import { Storage } from '@ionic/storage';

//import documentationEntry utility class
import { SetbackSuccessDocumentationEntry } from '../../classes/setbackSuccessdocumentationEntry';
import { analyzeAndValidateNgModules } from '@angular/compiler';

//import providers
import { SetbackSuccessDocumentationEntryDatabaseProvider } from '../../providers/database/setbackSuccessDocumentationEntryDB';

/**
 * Generated class for the SetbackSuccessPage page.
 *
 * @author kochd1
 */

@IonicPage()
@Component({
  selector: 'page-documentation-setback-success',
  templateUrl: 'documentation-setback-success.html',
})
export class DocumentationSetbackSuccessPage {

  setbackSuccessdocumentationEntry: SetbackSuccessDocumentationEntry;

  /**
   * stores the subject entry data input from the modal
   */
  inputSubjectEntryData: string;

  /**
   * stores the reason entry data input from the modal
   */
  inputReasonEntryData: string;

  /**
   * stores the data from the storage to edit via modal.
   */
  storageDataToEdit: string;

  /**
   * id of this documentation entry.
   */
  setbackSuccessdocumentationEntryId: number;

  /**
   * collection of setback entries.
   */
  setbackDocumentationEntryCollection: SetbackSuccessDocumentationEntry[] = [];

  setbackDocumentationEntryCollectionIsNull: boolean;

  /**
   * collection of success entries.
   */
  successDocumentationEntryCollection: SetbackSuccessDocumentationEntry[] = [];

  successDocumentationEntryCollectionIsNull: boolean;

  /**
   * boolean variable for new entry
   */
  newEntry: boolean;

  isSetbackEntry: boolean;
  isSuccessEntry: boolean;

  aboutToEdit: boolean;

  editId: number;

  createDate: Date;

  entryIndex: number;

  slidingItem;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private storage: Storage,
    public dEntryDbp: SetbackSuccessDocumentationEntryDatabaseProvider) {

    let newDate: Date = new Date();
    this.setbackSuccessdocumentationEntry = new SetbackSuccessDocumentationEntry(0, newDate, "", "");
    this.setbackDocumentationEntryCollectionIsNull = false;
    this.successDocumentationEntryCollectionIsNull = false;

    this.newEntry = false;
    this.isSetbackEntry = false;
    this.isSuccessEntry = false;
    this.aboutToEdit = false;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DocumentationSetbackSuccessPage');


    //this.documentationEntryCollection.push(this.testData);
    let that = this;
    //setback documentation entry collection
    this.storage.get('setbackDocumentationEntryCollection').then((value => {
      if (value != null) {
        that.setbackDocumentationEntryCollection = value;
      }

      else {
        that.setbackDocumentationEntryCollectionIsNull = true;
      }
      console.log("ionViewDidLoad() -> setbackDocumentationEntryCollection: ", that.setbackDocumentationEntryCollection);

    }));

    //success documentation entry collection
    this.storage.get('successDocumentationEntryCollection').then((value => {
      if (value != null) {
        that.successDocumentationEntryCollection = value;
      }

      else {
        that.successDocumentationEntryCollectionIsNull = true;
      }
      console.log("ionViewDidLoad() -> successDocumentationEntryCollection: ", that.successDocumentationEntryCollection);

    }));
  }

  /**
   * Sets the type of this entry via "add entry" button.
   */
  public setEntryType(entryType: string) {
    this.setbackSuccessdocumentationEntry = null; //reset documentation entry (necessary, if an entry modification is aborted)
    this.aboutToEdit = false; //same reason

    console.log("setEntryType() called with value: ", entryType)
    if (entryType == 'setback') {
      this.isSetbackEntry = true;
      console.log("setEntryType() -> this.isSetback: ", this.isSetbackEntry);
      this.isSuccessEntry = false; //vice versa
    }

    else {
      this.isSuccessEntry = true;
      console.log("setEntryType() -> this.isSuccess: ", this.isSuccessEntry);
      this.isSetbackEntry = false; //necessary, if user firstly want to enter a setback
    }
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

      let myModalData: SetbackSuccessDocumentationEntry = this.setbackSuccessdocumentationEntry;
      console.log("myModalData (data to pass to modal): ", myModalData); //as expected

      myModal = this.modalCtrl.create('SetbackSuccessModalPage', { data: myModalData }, myModalOptions);
    }

    else {
      myModal = this.modalCtrl.create('SetbackSuccessModalPage', myModalOptions);
    }

    myModal.present();

    let that = this;
    //let inputData: string;

    myModal.onDidDismiss((data) => {
      console.log("data from modal:", data);
      //that.documentationEntry.entryText = data;
      that.inputSubjectEntryData = data.subject;
      that.inputReasonEntryData = data.reason;

      this.setbackSuccessdocumentationEntry = data;

      if (that.inputSubjectEntryData) {
        that.newEntry = true;
      }
      console.log("modal onDidDismiss -> newEntry: ", that.newEntry);

      //console.log("documentationEntry.entryText after modal: ", this.documentationEntry.entryText); //undefined
      console.log("this.inputSubjectEntryData after modal: ", this.inputSubjectEntryData); //as expected
      console.log("this.inputReasonEntryData after modal: ", this.inputReasonEntryData); //as expected

      if (data != null) {
        this.saveDocumentationEntry();
        console.log("saveDocumentationEntry() called")
      }

    });

  }

  /**
   * Add an entry to the list (saving is not handled here)
   * @deprecated
   */
  public addDocumentationEntry() {
    console.log("addDocumentationEntry() called");

    this.setbackSuccessdocumentationEntry.entryId = 1;
    //this.documentationEntry.entryDate= new Date();
    //this.documentationEntry.entryText='';

    console.log("documentationEntry_temp: ", this.setbackSuccessdocumentationEntry);
    this.setbackDocumentationEntryCollection.push(this.setbackSuccessdocumentationEntry);
    this.newEntry = true;

  }

  /**
   * Aborts the entry input and splices the last unfinished/unsaved entry.
   * @deprecated
   */
  public abortEntryInput() {
    this.newEntry = false;
    this.setbackDocumentationEntryCollection.splice(this.setbackDocumentationEntryCollection.length - 1, 1);
  }

  /**
   * Saves the documentation entry from the modal input.
   */
  public saveDocumentationEntry() {
    this.newEntry = true;

    let entryDate = new Date();
    let entryId;
    if (this.aboutToEdit == true) {
      entryId = this.editId;
      entryDate = this.createDate;
    }
    else {
      entryId = Number(entryDate);
    }

    let entrySubjectText = this.inputSubjectEntryData;
    let entryReasonText = this.inputReasonEntryData;

    this.setbackSuccessdocumentationEntry = new SetbackSuccessDocumentationEntry(entryId, entryDate, entrySubjectText, entryReasonText);

    this.dEntryDbp.saveDocumentationEntry(this.setbackSuccessdocumentationEntry, this.isSetbackEntry);

    if (this.aboutToEdit) {
      if (this.isSetbackEntry) {
        this.setbackDocumentationEntryCollection.splice(this.entryIndex, 1);
      }

      else {
        this.successDocumentationEntryCollection.splice(this.entryIndex, 1);
      }

    }

    console.log("saveDocumentationEntry() -> this.isSetbackEntry: ", this.isSetbackEntry);
    console.log("saveDocumentationEntry() -> this.isSuccessEntry: ", this.isSuccessEntry);

    if (this.isSetbackEntry) {
      this.setbackDocumentationEntryCollection.push(this.setbackSuccessdocumentationEntry);
      console.log("this.setbackDocumentationEntryCollection was pushed.");
    }

    else {
      this.successDocumentationEntryCollection.push(this.setbackSuccessdocumentationEntry);
      console.log("this.successDocumentationEntryCollection was pushed.");
    }


    console.log("saveDocumentationEntry() -> documentationEntry", this.setbackSuccessdocumentationEntry);

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
   * @param dEntryId
   * @param index
   */
  public editDocumentationEntry(dEntryId: number, dEntryDate: Date, index: number) {
    console.log("editDocumentationEntry() -> dEntryId: ", dEntryId); //as expected
    this.aboutToEdit = true;
    this.editId = dEntryId;
    this.createDate = dEntryDate;
    this.entryIndex = index;
    //get element by id
    let that = this;

    this.setbackSuccessdocumentationEntry = that.setbackSuccessdocumentationEntry; //is not a solution

    this.dEntryDbp.getDocumentationEntryById(dEntryId, this.isSetbackEntry).then((dEntry) => {

      that.setbackSuccessdocumentationEntry = dEntry;
      //documentationEntry = dEntry;
      console.log("editDocumentationEntry() -> text after storage access: ", that.setbackSuccessdocumentationEntry); //

      this.openModal(); //must be called here, otherwise the value of dEntry can't be passed to the modal!
      this.closeSlidingItem(this.slidingItem); //closes after the edit btn was fired
    });

  }

  /**
   * deletes the respective documentation entry.
   *
   * @param dEntryId - the id of the entry
   * @param index - the index of the entry (relevant for the data presentation)
   */
  public deleteDocumentationEntry(dEntryId: number, index: number) { //vorher (item)
    console.log("deleteEntry() called");

    this.setbackSuccessdocumentationEntryId = dEntryId;

    console.log("documentationEntryDelete -> documentationEntryId (local param): " + dEntryId);
    console.log("documentationEntryDelete -> documentationEntryId (instance variable): " + this.setbackSuccessdocumentationEntryId);

    console.log("deleteDocumentatioEntry (logic)-> this.issetback before DB: ", this.isSetbackEntry);

    this.dEntryDbp.deleteDocumentationEntry(dEntryId, this.isSetbackEntry); //db processing

    if (this.isSetbackEntry) {
      this.setbackDocumentationEntryCollection.splice(index, 1);
    }

    else {
      this.successDocumentationEntryCollection.splice(index, 1);
    }

  }

  public gotoInformationPage() {
    //this.navCtrl.push(InformationPage, {});
    this.navCtrl.popToRoot();
  }

}
