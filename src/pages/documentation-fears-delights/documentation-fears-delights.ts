import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Modal, ModalController, ModalOptions } from 'ionic-angular';
import { InformationDocumentationPage } from '../information-documentation/information-documentation';
import { Storage } from '@ionic/storage';

//import documentationEntry utility class
import { DocumentationEntry } from '../../classes/documentationEntry';
import { analyzeAndValidateNgModules } from '@angular/compiler';

//services
import { AwardService } from '../../services/awards.service';

//import providers
import { FearDelightDocumentationEntryDatabaseProvider } from '../../providers/database/fearDelightDocumentationEntryDB';

@IonicPage()
@Component({
  selector: 'page-documentation-fears-delights',
  templateUrl: 'documentation-fears-delights.html',
})
export class DocumentationFearsDelightsPage {
  //@ViewChild('refresherRef') refresherRef;

  testData: any;

  documentationEntry: DocumentationEntry;

  /**
   * stores the data input from the modal
   */
  inputData: string;

  /**
   * stores the data from the storage to edit via modal.
   */
  storageDataToEdit: string;

  /**
   * id of this documentation entry.
   */
  documentationEntryId: number;

  /**
   * collection of fear entries.
   */
  fearDocumentationEntryCollection: DocumentationEntry[] = [];

  fearDocumentationEntryCollectionIsNull: boolean;

  /**
   * collection of delight entries.
   */
  delightDocumentationEntryCollection: DocumentationEntry[] = [];

  delightDocumentationEntryCollectionIsNull: boolean;

  /**
   * boolean variable for new entry
   */
  newEntry: boolean;

  isFear: boolean;
  isDelight: boolean;

  aboutToEdit: boolean;

  editId: number;

  entryIndex: number;

  slidingItem;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private storage: Storage,
    public awardService: AwardService,
    public dEntryDbp: FearDelightDocumentationEntryDatabaseProvider) {

    let newDate: Date = new Date();
    this.documentationEntry = new DocumentationEntry(0, newDate, "");
    this.fearDocumentationEntryCollectionIsNull = false;
    this.delightDocumentationEntryCollectionIsNull = false;

    this.newEntry = false;
    this.isFear = false;
    this.isDelight = false;
    this.aboutToEdit = false;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DocumentationFearsDelightsPage');


    //this.documentationEntryCollection.push(this.testData);
    let that = this;
    //fear documentation entry collection
    this.storage.get('fearDocumentationEntryCollection').then((value => {
      if (value != null) {
        that.fearDocumentationEntryCollection = value;
      }

      else {
        that.fearDocumentationEntryCollectionIsNull = true;
      }
      console.log("ionViewDidLoad() -> fearDocumentationEntryCollection: ", that.fearDocumentationEntryCollection);

    }));

    //delight documentation entry collection
    this.storage.get('delightDocumentationEntryCollection').then((value => {
      if (value != null) {
        that.delightDocumentationEntryCollection = value;
      }

      else {
        that.delightDocumentationEntryCollectionIsNull = true;
      }
      console.log("ionViewDidLoad() -> delightDocumentationEntryCollection: ", that.delightDocumentationEntryCollection);

    }));
  }

  /**
   * Sets the type of this entry via "add entry" button.
   */
  public setEntryType(entryType: string) {
    this.documentationEntry = null; //reset documentation entry (necessary, if an entry modification is aborted)
    this.aboutToEdit = false; //same reason

    console.log("setEntryType() called with value: ", entryType)
    if (entryType == 'fear') {
      this.isFear = true;
      console.log("setEntryType() -> this.isFear: ", this.isFear);
      this.isDelight = false; //vice versa
    }

    else {
      this.isDelight = true;
      console.log("setEntryType() -> this.isDelight: ", this.isDelight);
      this.isFear = false; //necessary, if user firstly want to enter a fear
    }
  }

  /**
   * opens the modal to add or to edit an entry.
   */
  public openModal() {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false, //user can only go back via close btn
      cssClass: 'documentationEntry'
    }

    let myModal: Modal;

    //only go through, if there's an entry to edit
    if (this.aboutToEdit == true) {

      let myModalData: DocumentationEntry = this.documentationEntry;
      console.log("myModalData (data to pass to modal): ", myModalData); //as expected

      myModal = this.modalCtrl.create('ModalDocumentationEntryPage', { data: myModalData }, myModalOptions);
    }

    else {
      myModal = this.modalCtrl.create('ModalDocumentationEntryPage', null, myModalOptions); //if there's no data to pass, set null (otherwhise options are not passed)
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

    this.documentationEntry.entryId = 1;
    //this.documentationEntry.entryDate= new Date();
    //this.documentationEntry.entryText='';

    console.log("documentationEntry_temp: ", this.documentationEntry);
    this.fearDocumentationEntryCollection.push(this.documentationEntry);
    this.newEntry = true;

  }

  /**
   * Aborts the entry input and splices the last unfinished/unsaved entry.
   * @deprecated
   */
  public abortEntryInput() {
    this.newEntry = false;
    this.fearDocumentationEntryCollection.splice(this.fearDocumentationEntryCollection.length - 1, 1);
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
    }
    else {
      entryId = Number(entryDate);
    }

    let entryText = this.inputData;

    this.documentationEntry = new DocumentationEntry(entryId, entryDate, entryText);

    this.dEntryDbp.saveDocumentationEntry(this.documentationEntry, this.isFear);

    if (this.aboutToEdit) {
      if (this.isFear) {
        this.fearDocumentationEntryCollection.splice(this.entryIndex, 1);
      }

      else {
        this.delightDocumentationEntryCollection.splice(this.entryIndex, 1);
      }

    }

    console.log("saveDocumentationEntry() -> this.isFear: ", this.isFear);
    console.log("saveDocumentationEntry() -> this.isDelight: ", this.isDelight);

    if (this.isFear) {
      this.fearDocumentationEntryCollection.push(this.documentationEntry);
      console.log("this.fearDocumentationEntryCollection was pushed.");
      this.awardService.checkAwardReceipt("Festgehalten");
    }

    else {
      this.delightDocumentationEntryCollection.push(this.documentationEntry);
      console.log("this.delightDocumentationEntryCollection was pushed.");
      this.awardService.checkAwardReceipt("Festgehalten");
    }


    console.log("saveDocumentationEntry() -> documentationEntry", this.documentationEntry);

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
  public editDocumentationEntry(dEntryId: number, index: number) {
    console.log("editDocumentationEntry() -> dEntryId: ", dEntryId); //as expected
    this.aboutToEdit = true;
    this.editId = dEntryId;
    this.entryIndex = index;
    //get element by id
    let that = this;

    this.documentationEntry = that.documentationEntry; //is not a solution

    //var documentationEntry: DocumentationEntry;

    this.dEntryDbp.getDocumentationEntryById(dEntryId, this.isFear).then((dEntry) => {

      that.documentationEntry = dEntry;
      //documentationEntry = dEntry;
      console.log("editDocumentationEntry() -> text after storage access: ", that.documentationEntry); //

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

    this.documentationEntryId = dEntryId;

    console.log("documentationEntryDelete -> documentationEntryId (local param): " + dEntryId);
    console.log("documentationEntryDelete -> documentationEntryId (instance variable): " + this.documentationEntryId);

    console.log("deleteDocumentatioEntry (logic)-> this.isFear before DB: ", this.isFear);

    this.dEntryDbp.deleteDocumentationEntry(dEntryId, this.isFear); //db processing

    if (this.isFear) {
      this.fearDocumentationEntryCollection.splice(index, 1);
    }

    else {
      this.delightDocumentationEntryCollection.splice(index, 1);
    }

  }

  public gotoInformationPage() {
    //this.navCtrl.push(InformationPage, {});
    this.navCtrl.popToRoot();
  }

}
