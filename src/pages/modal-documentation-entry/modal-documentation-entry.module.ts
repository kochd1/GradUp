import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalDocumentationEntryPage } from './modal-documentation-entry';

@NgModule({
  declarations: [
    ModalDocumentationEntryPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalDocumentationEntryPage),
  ],
})
export class ModalDocumentationEntryPageModule { }
