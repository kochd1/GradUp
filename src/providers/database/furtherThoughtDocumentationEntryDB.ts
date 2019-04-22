import { Injectable } from '@angular/core';
// import storage
import { Storage } from '@ionic/storage';

import { DocumentationEntry } from '../../classes/documentationEntry';

@Injectable()
export class FurtherThoughtDocumentationEntryDatabaseProvider {

  // views/beliefs documentation entry key
  furtherThoughtDocumentationEntryCollection_key: string = 'furtherThoughtDocumentationEntryCollection';

  constructor(public storage: Storage) {
    console.log('Hello FurtherThoughtDocumentationEntryDatabaseProvider Provider');
  }

  /**
   * Gets the document entry by its id.
   * @param id - id of the document
   */
  getDocumentationEntryById(id: number): Promise<DocumentationEntry> {

      return this.storage.get(this.furtherThoughtDocumentationEntryCollection_key).then((valArr) => {
        return valArr.find(DocumentationEntry => DocumentationEntry.entryId == id);
      });
  }

  /**
   * saves a  documentation entry (view/belief).
   * 
   * @param dEntry 
   */
  saveDocumentationEntry(dEntry: DocumentationEntry){

   this.storage.get(this.furtherThoughtDocumentationEntryCollection_key).then(dEntryColl => {
    console.log("dEntryDB_viewBelief saveDocumentationEntry() -> dEntryColl", dEntryColl);

    if(dEntryColl == null)
    {
      console.log(dEntry + typeof (dEntry));
      let viewBeliefDocumentationEntryCollection: DocumentationEntry[] = [];
      viewBeliefDocumentationEntryCollection.push(dEntry);
      this.storage.set(this.furtherThoughtDocumentationEntryCollection_key, viewBeliefDocumentationEntryCollection);
      console.log("storage was empty");
      return true;
    }

    else{
      let duplicatedEntry = dEntryColl.find(val => val.entryId == dEntry.entryId)
      console.log("saveDocumentationEntry() -> duplicatedEntry: ", duplicatedEntry)
      if(duplicatedEntry != null)
      {
        console.log("storage-->find dublicate", duplicatedEntry.entryId);
        this.deleteDocumentationEntry(duplicatedEntry.entryId).then(val => {
          if(val){
            this.storage.get(this.furtherThoughtDocumentationEntryCollection_key).then(dEntryCollWADuplicate => {
              let documentationEntryCollection: DocumentationEntry[] = dEntryCollWADuplicate;
              documentationEntryCollection.push(dEntry);
              this.storage.set(this.furtherThoughtDocumentationEntryCollection_key, documentationEntryCollection);
              return true;
            });
          }
        });
      }

      else{
        let viewBeliefDocumentationEntryCollection: DocumentationEntry[] = dEntryColl;
        viewBeliefDocumentationEntryCollection.push(dEntry);
        this.storage.set(this.furtherThoughtDocumentationEntryCollection_key, viewBeliefDocumentationEntryCollection);
        return true;
      }
    }
    return true;
   });

  

  }

  /**
   * deletes the documentation entry.
   * 
   * @param id - the id of this entry
   */
  deleteDocumentationEntry(id: number): Promise<boolean> {

      return this.storage.get(this.furtherThoughtDocumentationEntryCollection_key).then((valArr) => {
        let newArr = valArr.filter(val => val.entryId != id); //true -> wird in newArr geschrieben
        this.storage.set(this.furtherThoughtDocumentationEntryCollection_key, newArr);
        return true;
      });

  }

}