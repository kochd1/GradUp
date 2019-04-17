import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Modal, ModalController, ModalOptions } from 'ionic-angular';
import { InformationDocumentationPage } from '../information-documentation/information-documentation';
import { Storage } from '@ionic/storage';

//import documentationEntry utility class
import { DocumentationEntry } from '../../classes/documentationEntry';
import { analyzeAndValidateNgModules } from '@angular/compiler';

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
    * id of this journal entry.
    */
   documentationEntryId: number;

  documentationEntryCollection: DocumentationEntry[] = [];

  documentationEntryCollectionIsNull: boolean;

  newEntry: boolean;
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              private modalCtrl: ModalController,
              private storage: Storage) {

    this.items = [
      {title: 'Manchmal denke ich, ich sei nicht gut genug und verliere dadurch meinen Appetit.'},
      {title: 'item2'},
      {title: 'item3'}
    ];

    let newDate: Date = new Date();
    this.documentationEntry = new DocumentationEntry(0, newDate, "");
    this.documentationEntryCollectionIsNull = false;

    this.newEntry=false;

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
   * opens the modal to make a new entry.
   */
  public openModal(){

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false, //user can only go back via close btn
    }

    //test
    /*const myModalData = {
      name: 'Dominik',
      occupation: 'student'
    };*/

    const myModal: Modal = this.modalCtrl.create('ModalPage', myModalOptions); //{data: myModalData}

    myModal.present();

    let that = this;
    myModal.onDidDismiss((data) => {
      console.log("data from modal:", data);
      that.documentationEntry.entryText = data;
      that.newEntry=true;
      
      
      console.log("newEntry: ", that.newEntry); //funktioniert nicht

      //if(this.newEntry==true)
      //{
      console.log("documentationEntry.entryText after modal: ", this.documentationEntry.entryText);
      this.saveDocumentationEntry();
      console.log("saveDocumentationEntry() called")
      //}
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
  
  
   let entryDate = new Date();
   let entryId = Number(new Date);
   let entryText = this.documentationEntry.entryText;

   this.documentationEntry = new DocumentationEntry(entryId, entryDate, entryText);

   this.documentationEntryCollection.push(this.documentationEntry);
   console.log("saveDocumentationEntry() -> documentationEntry", this.documentationEntry);

   this.storage.set('documentationEntryCollection', this.documentationEntryCollection);
   console.log("saveDocumentationEntry() -> documentationEntryColl", this.documentationEntryCollection);

   //this.documentationEntry.entryText="reset!"; //reset

 }

 public getAllDocumentationEntries(){

 }

  public editDocumentationEntry(dEntryId: number){

  }

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
