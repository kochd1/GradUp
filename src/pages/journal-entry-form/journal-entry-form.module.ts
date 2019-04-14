import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JournalEntryFormPage } from './journal-entry-form';

@NgModule({
  declarations: [
    JournalEntryFormPage,
  ],
  imports: [
    IonicPageModule.forChild(JournalEntryFormPage),
  ],
})
export class JournalEntryFormPageModule {}
