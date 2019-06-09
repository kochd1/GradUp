import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, AlertController, FabContainer, Events } from 'ionic-angular';
import { JournalPage } from '../journal/journal';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';

//Form Validation
//import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

//import Providers
import { DatabaseProvider } from '../../providers/database/database';
//import { PhotoProvider } from '../../providers/photo/photo';

//MIDATA imports
import { MidataService } from '../../services/MidataService';
import { Observation } from 'Midata';
import { ObsMentalCondition } from '../../resources/subjectiveCondition';


//import journalEntry utility class
import { JournalEntry } from '../../classes/journalEntry';

//import journalDeletePage
import { JournalEntryListPage } from '../journal-entry-list/journal-entry-list'; //not sure if needed...

/**
 * Generated class for the JournalEntryPage page.
 * @author kochd1
 */
@IonicPage()
@Component({
  selector: 'page-journal-entry-form',
  templateUrl: 'journal-entry-form.html',
})
export class JournalEntryFormPage {
  //@ViewChild(Navbar) navBar: Navbar;

  //Form Validation
  //formgroup:FormGroup;
  //date:AbstractControl;
  //text:AbstractControl;
  //photo:AbstractControl;
  //smilie:AbstractControl;

  /**
   *  journal Entry
   */
  journalEntry: JournalEntry;

  /**
   * collection of journal entries
   */
  journalEntryCollection: JournalEntry[] = [];

  journalDeletePage: JournalEntryListPage;

  /**
   * variable which stores the user input concerning the subj. condition.
   */
  subjectiveCondition: number;

  /**
   * stores the reason for the current mood of the user.
   */
  moodReason: string;

  /**
   * #MIDATA -> array for the weight data
     store the raw data in this array.
   */
  subjectiveConditionData: Array<{ date: Date, value: number }>;

  /**
   * variable to store the image data
   */
  myPhoto: any;

  /**
   * For popup ionViewCanLeave
   */
  showAlertMessage: boolean;

  /**
   * For popup ionViewCanLeave
   */
  backBtnClicked: boolean;

  /**
   * Counter variable for instant feedback
   */
  counter: number = 0;



  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private midataService: MidataService,
    public dbp: DatabaseProvider,
    private storage: Storage,
    private camera: Camera,
    private alertCtrl: AlertController,
    //private formBuilder: FormBuilder,
    public events: Events) {

    //Form Validation
    //this.formgroup = formBuilder.group({
    //date:['', Validators.required],
    //text:['', Validators.required],
    //photo:['', Validators.required]
    //smilie:['', Validators.required]
    //});

    //controls
    //this.date = this.formgroup.controls['date'];
    //this.text = this.formgroup.controls['text'];
    //this.photo = this.formgroup.controls['photo'];
    //this.smilie = this.formgroup.controls['smilie'];

    this.journalEntry = new JournalEntry(); //without this, the page will throw a "Uncaught (in promise): TypeError"

    this.journalEntry.entryMoodReason = "";

    this.moodReason = "";

    //#MIDATA
    this.subjectiveConditionData = new Array<{ date: Date, value: number }>();

    this.showAlertMessage = true;
    this.backBtnClicked = false;


  }

  /**
   * Runs when the page is about to enter and become the active page.
   */
  ionViewWillEnter() {
    console.log("ionViewWillEnter journalEntryPage");

    //this.journalEntryId = this.navParams.data; //-> fetches data from "journal-deletePage" --> do not delete!, otherwise delete won't work properly

    this.journalEntry = this.navParams.data; //get full entry data from the JournalEntryListPage

    console.log("this.journalEntry.entryDate: ", this.journalEntry.entryDate);

    if (this.journalEntry.entryDate == null) {
      this.journalEntry.entryDate = new Date().toISOString().substring(0, 10);
      console.log("this.journalEntry.entryDate after undefined: ", this.journalEntry.entryDate);
    }

    console.log("ionViewWillEnter() -> journalEntry:", this.journalEntry);

    this.myPhoto = this.journalEntry.entryPhoto;

    this.subjectiveCondition = this.journalEntry.entrySubjCondition;
    console.log("ionViewWillEnter() -> subj. Condition (local):", this.journalEntry.entrySubjCondition);

    this.moodReason = this.journalEntry.entryMoodReason;
    console.log("ionViewWillEnter() -> mood reason (local):", this.journalEntry.entryMoodReason);

    //console.log("ionViewWillEnter() -> subj. Condition (MIDATA):", this.);


    this.dbp.getJournalEntryCollection().then((val) => {
      if (val == null) {
        // There's no journalEntry
        console.log("ionViewWillEnter() -> val == null?:", val);
        this.showUserInformation();
      }

    });


    let that = this;

    this.storage.get('InstantFeedback').then((value) => {
      if (value == null) {
        that.counter = 1;
        this.storage.set('InstantFeedback', that.counter);
        console.log("counter after empty storage", that.counter);
      }

      else {
        that.counter = value;
        console.log("ionViewWillEnter() -> that.counter (if not empty)", that.counter);
      }
    });

    //#MIDATA -> load the elements
    this.loadData();

  }

  //Runs when the page has loaded.
  ionViewDidLoad() {

    //this.loadData();
    /*console.log('ionViewDidLoad JournalEntryPage');
    this.dbp.getJournalEntryCollection().then((val) => {
     if(val == null ) {
        //no entry there
     } else {
       this.journalEntryCollection = val;
     }
    });*/

    //this.journalEntry = this.navParams.data; //-> fetches data from "journal-deletePage"


  }

  showUserInformation() {

    let alert = this.alertCtrl.create({
      title: 'Infos über die Datenspeicherung',
      subTitle: 'Deine Text- und Bilddateneinträge werden nur lokal gespeichert und nicht für die Forschung verwendet.'
        + '<br> Angaben über deinen Gemütszustand (Smiley) werden auf MIDATA gespeichert. Diese Angaben sind jedoch optional. ',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            //do nothing
          }
        }
      ]
    });

    alert.present();

  }

  ionViewCanLeave() {
    //only show this alert, when back btn is clicked

    /*this.navBar.backButtonClick = (e: UIEvent) => {
      console.log("ionViewCanLeave() navBar.backButtonClick event");
      console.log("this.showAlertMessage: ", this.showAlertMessage);*/


    //this.navCtrl.popToRoot();

    if (this.backBtnClicked) {

      if (this.showAlertMessage) {
        let alert = this.alertCtrl.create({
          title: 'Achtung!',
          subTitle: 'Eintrag/Änderungen verwerfen?',
          buttons: [
            {
              text: 'Nein',
              handler: () => {
                console.log("discarded changes");
              }
            },
            {
              text: 'Ja',
              handler: () => {

                alert.dismiss().then(() => {
                  this.exitPage();
                })
              }
            }
          ]
        });

        alert.present();
        return false; //return false to avoid the page to be popped up
      }

    }

  }

  private exitPage() {
    this.showAlertMessage = false;
    this.navCtrl.popToRoot();
  }

  /**
   * Adds subjective condition from user input to the resp. global variable.
   * @param value
   */
  addSubjConditionInput(value: number) {
    this.subjectiveCondition = value;
  }



  //kochd1: This codeline below is necessary to display the today's date.
  myDate: any = new Date().toISOString();

  /**
   * Saves the journal entry to database.
   */
  public saveJournalEntry(): void {
    console.log("saveJournalEntry() called");

    console.log("saveJournalEntry() -> this.journalEntry.entryDate: ", this.journalEntry.entryDate); //YYYY-MM-DD format

    //checks before setting the id, if it is a new or edited entry
    if (this.journalEntry.entryId == 0 || this.journalEntry.entryId == null) {
      console.log("saveEntry() -> entryId:", this.journalEntry.entryId);
      this.journalEntry.entryId = Number(new Date()); //.getTime);
    }

    console.log("saveEntry() -> entryPhoto", this.myPhoto);
    this.journalEntry.entryPhoto = this.myPhoto;

    this.dbp.saveJournalEntry(this.journalEntry);

    //retest before removal!
    /*.then(val => {
      if(val)
        this.dbp.getJournalEntryCollection().then((val) =>{
          //this.navCtrl.push(JournalPage);
        });
    });*/

    //check which condition was entered
    if (this.subjectiveCondition == 0 || this.subjectiveCondition == 1 || this.subjectiveCondition == 2) {

      console.log("saveEntry() -> subjective condition input: ", this.subjectiveCondition);
      console.log("saveEntry() -> mood reason input: ", this.moodReason);

      let moodReason: string;

      if (this.journalEntry.entryMoodReason) {
        moodReason = this.journalEntry.entryMoodReason;
      }

      else {
        moodReason = "N/A" //so that if it is null, it is shown something useful on MIDATA
      }

      let mentalCondition = new ObsMentalCondition(this.subjectiveCondition, moodReason);
      this.journalEntry.entrySubjCondition = this.subjectiveCondition; //local copy
      this.midataService.save(mentalCondition)
        .then((response) => {
          // we can now access the midata response
          console.log("ObsMentalCondition fired on MIDATA");


        }).catch((error) => {
          console.error("Error in save request:", error);
        });

      console.log("mental condition: " + mentalCondition);
    }

    this.backBtnClicked = false; //otherwise popup is shown, when user beforhand tried to leave the page.

    //this.addMentalCondition();
    //console.log("addMentalCondition is called");


    //instant feedback
    this.counter++;
    console.log("saveEntry() -> this.counter (if not empty)", this.counter);
    this.storage.set('InstantFeedback', this.counter);
    this.showInstantFeedback();

  }

  /**
 * #MIDATA: loads the data (FHIR Observations with code "subjective-condition") from the MIDATA server
 */
  private loadData(): void {
    this.midataService.search('Observation/$lastn', { max: 1000, _sort: '-date', code: "subjective-condition", patient: this.midataService.getUser().id })
      .then(response => {
        if (response.length > 0) {
          response.forEach((measure: Observation) => {
            //console.log(measure.getProperty('valueQuantity')['value'], measure.getProperty('effectiveDateTime'));
            this.addSubjectiveCondition(measure.getProperty('valueQuantity')['value'], measure.getProperty('effectiveDateTime'));
          });
          /* TODO:  to test */
          /* TODO: catch error */
        }
      }
      );

  }

  /**
    * #MIDATA: add the weight values to the weightData array.
    *
    * @param measure
    * @param date
    */
  public addSubjectiveCondition(measure: number, date: Date): void {
    /*if (moment().diff(date) >= 0){
    }*/

    //push the data to the array
    this.subjectiveConditionData.push({ date: date, value: measure });
    //this.subjectiveCondition = measure; //!!problem with new entry!!
  }

  public gotoJournalPage() {
    this.backBtnClicked = true;
    //this.navCtrl.push(JournalPage, {});
    this.navCtrl.popToRoot();

    /*for (let entry of this.subjectiveConditionData){
      console.log("All subjCondition values (MIDATA)", entry);
    }*/
  }


  clickMainFAB() {
    console.log("Clicked open menu")
  }

  /**
   * Gets image from Android photo gallery and fills the image placeholder with the respective image.
   */
  getImage(event, fab1: FabContainer) {

    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,//this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false
    }
    fab1.close(); //close fab btn in the meantime
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):

      //this.navCtrl.push(JournalEntryPage);

      this.myPhoto = 'data:image/jpg;base64,' + imageData; // 'data:image/jpeg;base64,'

    }, (err) => {
      // Handle error
    });

  }

  /**
   * Activates the Android camera funtion and fills the image placeholder with the taken picture.
   */
  takePhoto(event, fab1: FabContainer) {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,//this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true
    }

    fab1.close(); //close fab btn in the meantime
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.myPhoto = 'data:image/jpg;base64,' + imageData; // 'data:image/jpeg;base64,'
    }, (err) => {
      // Handle error
    });
  }

  /**
   * Show instant feedback after saving a journal entry. There are three variants of feedbacks.
   */
  showInstantFeedback() {

    if (this.counter == 1) {

      let alert1 = this.alertCtrl.create({
        title: '',
        subTitle: 'Schön, dass du dir die Zeit nimmst, deine Gefühle/Erlebnisse zu dokumentieren.',
        cssClass: 'alert-button-inner',
        buttons: [
          {
            text: 'Weiter',
            handler: () => {
              this.navCtrl.popToRoot();
            }
          }
        ]
      });

      alert1.present();

    }

    if (this.counter == 2) {

      let alert2 = this.alertCtrl.create({
        title: '',
        subTitle: 'Vielen Dank für deinen Eintrag. :)',
        cssClass: 'alert-button-inner',
        buttons: [
          {
            text: 'Weiter',
            handler: () => {
              this.navCtrl.popToRoot();
            }
          }
        ]
      });

      alert2.present();

    }

    if (this.counter == 3) {
      this.counter = 0;
      console.log("alert3: this.counter", this.counter);
      this.storage.set('InstantFeedback', this.counter);

      let alert3 = this.alertCtrl.create({
        title: '',
        subTitle: 'Super, danke fürs Eintragen :)',
        cssClass: 'alert-button-inner',
        buttons: [
          {
            text: 'Weiter',
            handler: () => {
              this.navCtrl.popToRoot();
            }
          }
        ]
      });

      alert3.present();
    }

  }


}

