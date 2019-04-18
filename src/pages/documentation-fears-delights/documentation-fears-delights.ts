import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Modal, ModalController, ModalOptions } from 'ionic-angular';
import { InformationDocumentationPage } from '../information-documentation/information-documentation';
import { Storage } from '@ionic/storage';

//import documentationEntry utility class
import { DocumentationEntry } from '../../classes/documentationEntry';
import { analyzeAndValidateNgModules } from '@angular/compiler';

//import providers
import { DocumentationEntryDatabaseProvider } from '../../providers/database/documentationEntryDB';

@IonicPage()
@Component({
  selector: 'page-documentation-fears-delights',
  templateUrl: 'documentation-fears-delights.html',
})
export class DocumentationFearsDelightsPage {
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
    * id of this journal entry.
    */
   documentationEntryId: number;

  documentationEntryCollection: DocumentationEntry[] = [];

  documentationEntryCollectionIsNull: boolean;

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
              public dEntryDbp: DocumentationEntryDatabaseProvider) {

    this.items = [
      {title: 'Manchmal denke ich, ich sei nicht gut genug und verliere dadurch meinen Appetit.'},
      {title: 'item2'},
      {title: 'item3'}
    ];

    let newDate: Date = new Date();
    this.documentationEntry = new DocumentationEntry(0, newDate, "");
    this.documentationEntryCollectionIsNull = false;

    this.newEntry=false;
    this.aboutToEdit=false;

    //test
    /*this.documentationEntryCollection = [
      {entryId: 1, entryDate: new Date(), entryText: "Hallo1"},
      {entryId: 2, entryDate: new Date(), entryText: "Hallo2"},
      {entryId: 3, entryDate: new Date(), entryText: "Hallo3"},
    ]

    this.storage.set('documentationEntryCollection', this.documentationEntryCollection);*/

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DocumentationFearsDelightsPage');

  
    //this.documentationEntryCollection.push(this.testData);
    let that = this;
    this.storage.get('documentationEntryCollection').then((value => {
      if(value!=null)
      {
      that.documentationEntryCollection = value;
      }

      else{
        that.documentationEntryCollectionIsNull = true;
      }
      console.log("ionViewDidLoad() -> documentationEntryCollection: ", that.documentationEntryCollection);

    }));
  }

  /**
   * opens the modal to add or to edit an entry.
   */
  public openModal(){

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false, //user can only go back via close btn
    }

    let myModal: Modal;

    //only go through, if there's an entry to edit
    if(this.aboutToEdit==true)
    {
    /*const myModalData = {
      name: 'Dominik',
      occupation: 'student'
    };*/

    let myModalData: DocumentationEntry = this.documentationEntry;
    console.log("myModalData (data to pass to modal): ", myModalData); //as expected

    myModal = this.modalCtrl.create('ModalPage', {data: myModalData}, myModalOptions);
    }

    else{
      myModal = this.modalCtrl.create('ModalPage', myModalOptions);
    }

    myModal.present();

    let that = this;
    //let inputData: string;

    myModal.onDidDismiss((data) => {
      console.log("data from modal:", data);
      //that.documentationEntry.entryText = data;
      that.inputData = data;
      that.newEntry=true;
      console.log("newEntry: ", that.newEntry);
      
      //console.log("documentationEntry.entryText after modal: ", this.documentationEntry.entryText); //undefined
      console.log("this.inputData after modal: ", this.inputData); //as expected

      if(data!=null)
      { 
        this.saveDocumentationEntry();
        console.log("saveDocumentationEntry() called")
      }
     
    });

  }
  
  /**
   * Add an entry to the list (saving is not handled here)
   */
 public addDocumentationEntry(){
  console.log("addDocumentationEntry() called");

  //test
  /*this.documentationEntryCollection = [
    {entryId: 1, entryDate: new Date(), entryText: "Hallo1"},
    {entryId: 2, entryDate: new Date(), entryText: "Hallo2"},
    {entryId: 3, entryDate: new Date(), entryText: "Hallo3"},
  ]

  this.storage.set('documentationEntryCollection', this.documentationEntryCollection);*/

  this.documentationEntry.entryId=1;
  //this.documentationEntry.entryDate= new Date();
  //this.documentationEntry.entryText='';

  console.log("documentationEntry_temp: ", this.documentationEntry);
  this.documentationEntryCollection.push(this.documentationEntry);
  this.newEntry = true;


 /*let prompt = this.alertCtrl.create({
    title: 'Neuer Dokumentationseintrag',
    inputs: [{
        name: 'title'
    }],
    buttons: [
        {
            text: 'Abbrechen'
        },
        {
            text: 'Hinzufügen',
            handler: data => {
                this.documentationEntryCollection.push(data);
            }
        }
    ]
});
//sollte besser multiline sein.
prompt.addInput({
  type: 'textarea',
  name: 'about',
  placeholder: 'Optional message'
});

prompt.present();*/

 }

 /**
  * Aborts the entry input and splices the last unfinished/unsaved entry.
  */
 public abortEntryInput(){
   this.newEntry=false;
   this.documentationEntryCollection.splice(this.documentationEntryCollection.length-1, 1);
 }

 /**
  * Saves the documentation entry from the modal input.
  */
 public saveDocumentationEntry(){
   this.newEntry=true;

   /*let entryId;
    //checks before setting the id, if it is a new or edited entry
    if(this.documentationEntry.entryId==0 || this.documentationEntry.entryId==null){
      console.log("saveDocumentationEntry() -> entryId:", this.documentationEntry.entryId);
      entryId = Number(new Date);
      //this.documentationEntry.entryId = Number(new Date()); //.getTime);
    }
    else{
      entryId = this.documentationEntry.entryId;
    }*/

   let entryDate = new Date();
   let entryId;
   if(this.aboutToEdit==true)
   {
      entryId = this.editId;
   }
   else{
    entryId = Number(entryDate);
   }
  
   let entryText = this.inputData;

   this.documentationEntry = new DocumentationEntry(entryId, entryDate, entryText);

   this.dEntryDbp.saveDocumentationEntry(this.documentationEntry);

   /*this.storage.get("documentationEntryCollection").then(collection => {

   });*/

   if(this.aboutToEdit){
    this.documentationEntryCollection.splice(this.entryIndex, 1); //test -> does not work
   }
   
   this.documentationEntryCollection.push(this.documentationEntry);
   console.log("saveDocumentationEntry() -> documentationEntry", this.documentationEntry);

   this.aboutToEdit = false; //necessary because of new entries without page reload

   /*this.storage.set('documentationEntryCollection', this.documentationEntryCollection);
   console.log("saveDocumentationEntry() -> documentationEntryColl", this.documentationEntryCollection);*/

   //this.documentationEntry.entryText="reset!"; //reset

 }

 public getAllDocumentationEntries(){

 }

 /**
  * closes the sliding item for editing.
  * 
  * @param slidingItem 
  */
 public closeSlidingItem(slidingItem){
  this.slidingItem = slidingItem;
  slidingItem.close();
 }

  /**
   * Gets the entry to edit and opens the modal.
   * 
   * @param dEntryId 
   * @param index 
   */
  public editDocumentationEntry(dEntryId: number, index: number){
    console.log("editDocumentationEntry() -> dEntryId: ", dEntryId); //as expected
    this.aboutToEdit=true;
    this.editId = dEntryId;
    this.entryIndex = index;
    //get element by id
    let that = this;

    this.documentationEntry=that.documentationEntry; //is not a solution

    //var documentationEntry: DocumentationEntry;

    this.dEntryDbp.getDocumentationEntryById(dEntryId).then((dEntry) =>{
      
      that.documentationEntry = dEntry;
      //documentationEntry = dEntry;
      console.log("editDocumentationEntry() -> text after storage access: ", that.documentationEntry); //

      this.openModal(); //must be called here, otherwise the value of dEntry can't be passed to the modal!
      this.closeSlidingItem(this.slidingItem);
    });

    /*console.log("editDocumentationEntry() -> text from storage (after =>) this: ", this.documentationEntry); //not correct
    console.log("editDocumentationEntry() -> text from storage (after =>) that: ", that.documentationEntry); //not correct
    console.log("editDocumentationEntry() -> text from storage (after =>) var: ", documentationEntry); //not correct*/

    
  }

  /**
   * deletes the respective documentation entry.
   * 
   * @param dEntryId - the id of the entry
   * @param index - the index of the entry (relevant for the data presentation)
   */
  public deleteDocumentationEntry(dEntryId: number, index: number){ //vorher (item)
    console.log("deleteEntry() called");

    this.documentationEntryId = dEntryId;

    console.log("documentationEntryDelete -> documentationEntryId (local param): " + dEntryId);
    console.log("documentationEntryDelete -> documentationEntryId (instance variable): " + this.documentationEntryId);

    return this.storage.get('documentationEntryCollection').then((valArr) => {
      let newArr = valArr.filter(val => val.entryId != dEntryId); //true -> wird in newArr geschrieben
      this.storage.set('documentationEntryCollection', newArr);

      this.documentationEntryCollection.splice(index, 1); //test
      return true;
    });

    /*let  i: number;
    for(i = 0; i< this.items.length; i++){
       if(this.items[i] == item){
         this.items.splice(i, 1);
       }
    }*/

  }

  public gotoInformationPage() {
    //this.navCtrl.push(InformationPage, {});
    this.navCtrl.popToRoot();
  }

  /*doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      this.refresherRef.complete();
    }, 2000);
  }*/

}
