import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JournalEntryListPage } from './journal-entry-list';

@NgModule({
  declarations: [
    JournalEntryListPage,
  ],
  imports: [
    IonicPageModule.forChild(JournalEntryListPage),
  ],
})
export class JournalEntryListPageModule {}
