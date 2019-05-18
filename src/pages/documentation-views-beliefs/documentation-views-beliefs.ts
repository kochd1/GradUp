import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Modal, ModalController, ModalOptions } from 'ionic-angular';
import { InformationDocumentationPage } from '../information-documentation/information-documentation';
import { Storage } from '@ionic/storage';

//import documentationEntry utility class
import { DocumentationEntry } from '../../classes/documentationEntry';
import { analyzeAndValidateNgModules } from '@angular/compiler';

//import providers
import { ViewBeliefDocumentationEntryDatabaseProvider } from '../../providers/database/viewBeliefDocumentationEntryDB';

//services
import { AwardService } from '../../services/awards.service';

@IonicPage()
@Component({
  selector: 'page-documentation-views-beliefs',
  templateUrl: 'documentation-views-beliefs.html',
})
export class DocumentationViewsBeliefsPage {
  //@ViewChild('refresherRef') refresherRef;

  items: any;

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
   * collection of views/beliefs entries.
   */
  viewBeliefDocumentationEntryCollection: DocumentationEntry[] = [];

  viewBeliefDocumentationEntryCollectionIsNull: boolean;

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
    public dEntryDbp: ViewBeliefDocumentationEntryDatabaseProvider,
    public awardService: AwardService) {

    let newDate: Date = new Date();
    this.documentationEntry = new DocumentationEntry(0, newDate, "");
    this.viewBeliefDocumentationEntryCollectionIsNull = false;

    this.newEntry = false;
    this.aboutToEdit = false;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DocumentationViewsBeliefsPage');


    //this.documentationEntryCollection.push(this.testData);
    let that = this;
    //fear documentation entry collection
    this.storage.get('viewBeliefDocumentationEntryCollection').then((value => {
      if (value != null) {
        that.viewBeliefDocumentationEntryCollection = value;
      }

      else {
        that.viewBeliefDocumentationEntryCollectionIsNull = true;
      }
      console.log("ionViewDidLoad() -> viewBeliefDocumentationEntryCollection: ", that.viewBeliefDocumentationEntryCollection);

    }));
  }

  /**
   * resets the "documentationEntry" and the "aboutToEdit" variable (necessary, if an entry modification is being aborted
   * and a new one is being created instead.) This method will be executed everytime the "add entry" button is being pushed.
   */
  public resetDocumentationEntry() {

    this.documentationEntry = null;
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

      let myModalData: DocumentationEntry = this.documentationEntry;
      console.log("myModalData (data to pass to modal): ", myModalData); //as expected

      myModal = this.modalCtrl.create('ModalDocumentationEntryPage', { data: myModalData }, myModalOptions);
    }

    else {
      myModal = this.modalCtrl.create('ModalDocumentationEntryPage', myModalOptions);
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
    this.viewBeliefDocumentationEntryCollection.push(this.documentationEntry);
    this.newEntry = true;

  }

  /**
   * Aborts the entry input and splices the last unfinished/unsaved entry.
   * @deprecated
   */
  public abortEntryInput() {
    this.newEntry = false;
    this.viewBeliefDocumentationEntryCollection.splice(this.viewBeliefDocumentationEntryCollection.length - 1, 1);
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

    this.dEntryDbp.saveDocumentationEntry(this.documentationEntry);

    if (this.aboutToEdit) {

      this.viewBeliefDocumentationEntryCollection.splice(this.entryIndex, 1);
    }


    this.viewBeliefDocumentationEntryCollection.push(this.documentationEntry);
    console.log("this.viewBeliefDocumentationEntryCollection was pushed.");
    this.awardService.checkAwardReceipt("Festgehalten");



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

    this.dEntryDbp.getDocumentationEntryById(dEntryId).then((dEntry) => {

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


    this.dEntryDbp.deleteDocumentationEntry(dEntryId); //db processing

    this.viewBeliefDocumentationEntryCollection.splice(index, 1);



  }

  public gotoInformationPage() {
    //this.navCtrl.push(InformationPage, {});
    this.navCtrl.popToRoot();
  }

}
