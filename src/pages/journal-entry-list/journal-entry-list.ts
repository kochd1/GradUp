import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, PopoverController, Events } from 'ionic-angular';
import { JournalPage } from '../journal/journal';

//component
import { PopoverComponent } from '../../components/popover/popover';

//class
import { JournalEntry } from '../../classes/journalEntry';

//Page, where the entries are being saved
import { JournalEntryFormPage } from '../journal-entry-form/journal-entry-form';

//import Providers
import { DatabaseProvider } from '../../providers/database/database';

/**
 * Generated class for the JournalDeletePage page.
 * @author kochd1
 */
@IonicPage()
@Component({
  selector: 'page-journal-entry-list',
  templateUrl: 'journal-entry-list.html',
})
export class JournalEntryListPage {

  /**
   * journal entry form page.
   */
  journalEntryFormPage: any = JournalEntryFormPage;

  /**
   * the journal entry.
   */
  journalEntry: JournalEntry;

  /**
   * id of this journal entry.
   */
  journalEntryId: number;

  /**
   * collection of journal entries.
   */
  journalEntryCollection: JournalEntry[] = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public dbp: DatabaseProvider,
    public events: Events,
    private alertCtrl: AlertController,
    private popoverCtrl: PopoverController) {
    console.log("visited constructor JournalDeletePage");

    /*this.events.subscribe('journalEntryCollection:updated', () => {
      this.ionViewWillEnter()

    });*/

    //this.journalEntry = new JournalEntry();
  }

  ionViewDidLoad() { //-> does not work, page is not getting reloaded after updating an journal entry
    console.log('ionViewDidLoad JournalDeletePage');

    this.dbp.getJournalEntryCollection().then((val) => {
      if (val == null) {
        // There's no journalEntry

      } else {
        this.journalEntryCollection = val;

        /*this.dbp.getJournalEntryById(this.journalEntryId).then((val) => {
          this.journalEntry = val;
        });*/
      }
    });

  }

  presentPopover(myEvent) {
    let myPopoverData = {
      infoText: "Hier kannst du deine erfassten Einträge ansehen, bearbeiten oder löschen."
    }
    let popover = this.popoverCtrl.create(PopoverComponent, { data: myPopoverData });
    popover.present({
      ev: myEvent
    });
  }

  ionViewWillEnter() {
    console.log("ionHomeViewWillEnter");

    //this.journalEntryCollection = this.navParams.data;
    //console.log("jEntryColl.: " + this.journalEntryCollection);

    this.dbp.getJournalEntryCollection().then((val) => {
      if (val == null) {
        // There's no journalEntry

      } else {
        this.journalEntryCollection = val;

        this.journalEntryCollection.forEach(jEntry => {
          console.log(jEntry.entryId);
        })

      }
    });
  }

  public gotoJournalPage() {
    //this.navCtrl.push(JournalPage, {});
    this.navCtrl.popToRoot();
  }

  /**
   * Edit the journal entry with the respective journal entry id
   *
   * @param jEntryId
   */
  editJournalEntry(jEntryId: number): void {

    this.dbp.getJournalEntryById(jEntryId).then((jEntry) => {
      this.navCtrl.push(this.journalEntryFormPage, jEntry);
    })

  }

  /**
   * Delete the journal entry with the respective journal entry id.
   * Show a pop up before the journal entry can be deleted.
   *
   * @param jEntryId
   */
  deleteJournalEntry(jEntryId: number): void {

    this.journalEntryId = jEntryId;

    console.log("journalDelete -> journalEntryId (local param): " + jEntryId);
    console.log("journalDelete -> journalEntryId (instance variable): " + this.journalEntryId);

    let alert = this.alertCtrl.create({
      title: "Achtung!",
      subTitle: "Wollen Sie diesen Eintrag wirklich löschen?",
      buttons: [
        {
          text: 'Ja',
          role: 'ja',
          handler: () => {
            this.dbp.deleteJournalEntryById(jEntryId).then(val => {
              if (val) {
                this.dbp.getJournalEntryCollection().then(valArray => {
                  this.journalEntryCollection = valArray;
                })

                this.gotoJournalPage();
              }
            })
          }
        },

        {
          text: 'Abbrechen',
          role: 'abbrechen',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    alert.present();
  }

}
