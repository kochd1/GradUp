import { Injectable } from '@angular/core';
// import storage
import { Storage } from '@ionic/storage';

import { DocumentationEntry } from '../../classes/documentationEntry';

@Injectable()
export class DocumentationEntryDatabaseProvider {

  // journalEntry key
  documentationEntryCollection_key: string = 'documentationEntryCollection';

  constructor(public storage: Storage) {
    console.log('Hello DocumentationEntryDatabaseProvider Provider');
  }

  /**
   * Gets the document entry by its id.
   * @param id - id of the document
   */
  getDocumentationEntryById(id: number): Promise<DocumentationEntry> {

    return this.storage.get(this.documentationEntryCollection_key).then((valArr) => {
      return valArr.find(DocumentationEntry => DocumentationEntry.entryId == id);
    });
  }

  /**
   * saves a  documentation entry.
   * @param dEntry 
   */
  saveDocumentationEntry(dEntry: DocumentationEntry){
    
   this.storage.get("documentationEntryCollection").then(dEntryColl => {
    console.log("saveDocumentationEntry() -> dEntryColl", dEntryColl);

    if(dEntryColl == null)
    {
      console.log(dEntry + typeof (dEntry));
      let journalEntryCollection: DocumentationEntry[] = [];
      journalEntryCollection.push(dEntry);
      this.storage.set(this.documentationEntryCollection_key, journalEntryCollection);
      console.log("storage was empty");
      return true;
    }

    else{
      let duplicatedEntry = dEntryColl.find(val => val.entryId == dEntry.entryId)
      console.log("saveDocumentationEntry() -> duplicatedEntry: ", duplicatedEntry)
      if(duplicatedEntry != null)
      {
        console.log("storage-->find dublicate", duplicatedEntry.entryId);
        this.deleteDocumentationEntryById(duplicatedEntry.entryId).then(val => {
          if(val){
            this.storage.get('documentationEntryCollection').then(dEntryCollWADuplicate => {
              let documentationEntryCollection: DocumentationEntry[] = dEntryCollWADuplicate;
              documentationEntryCollection.push(dEntry);
              this.storage.set('documentationEntryCollection', documentationEntryCollection);
              return true;
            });
          }
        });
      }

      else{
        let documentationEntryCollection: DocumentationEntry[] = dEntryColl;
        documentationEntryCollection.push(dEntry);
        this.storage.set('documentationEntryCollection', documentationEntryCollection);
        return true;
      }
    }
    return true;
   });

  }

  deleteDocumentationEntryById(id: number): Promise<boolean> {

    return this.storage.get(this.documentationEntryCollection_key).then((valArr) => {
      let newArr = valArr.filter(val => val.entryId != id); //true -> wird in newArr geschrieben
      this.storage.set(this.documentationEntryCollection_key, newArr);
      return true;
    });
  }

}