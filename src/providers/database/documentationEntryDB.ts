import { Injectable } from '@angular/core';
// import storage
import { Storage } from '@ionic/storage';

import { DocumentationEntry } from '../../classes/documentationEntry';

@Injectable()
export class DocumentationEntryDatabaseProvider {

  // fear documentation entry key
  fearDocumentationEntryCollection_key: string = 'fearDocumentationEntryCollection';

  // delight documentation entry key
  delightDocumentationEntryCollection_key: string = 'delightDocumentationEntryCollection';

  constructor(public storage: Storage) {
    console.log('Hello DocumentationEntryDatabaseProvider Provider');
  }

  /**
   * Gets the document entry by its id.
   * @param id - id of the document
   */
  getDocumentationEntryById(id: number): Promise<DocumentationEntry> {

    return this.storage.get(this.fearDocumentationEntryCollection_key).then((valArr) => {
      return valArr.find(DocumentationEntry => DocumentationEntry.entryId == id);
    });
  }

  /**
   * saves a  documentation entry (fear or delight).
   * 
   * @param dEntry 
   */
  saveDocumentationEntry(dEntry: DocumentationEntry, isFear: boolean){
  console.log("DB -> isFear: ", isFear);
  //fear
  if(isFear)
  {
   this.storage.get("fearDocumentationEntryCollection").then(dEntryColl => {
    console.log("dEntryDB_fear saveDocumentationEntry() -> dEntryColl", dEntryColl);

    if(dEntryColl == null)
    {
      console.log(dEntry + typeof (dEntry));
      let fearDocumentationEntryCollection: DocumentationEntry[] = [];
      fearDocumentationEntryCollection.push(dEntry);
      this.storage.set(this.fearDocumentationEntryCollection_key, fearDocumentationEntryCollection);
      console.log("storage was empty");
      return true;
    }

    else{
      let duplicatedEntry = dEntryColl.find(val => val.entryId == dEntry.entryId)
      console.log("saveDocumentationEntry() -> duplicatedEntry: ", duplicatedEntry)
      if(duplicatedEntry != null)
      {
        console.log("storage-->find dublicate", duplicatedEntry.entryId);
        this.deleteDocumentationEntry(duplicatedEntry.entryId, isFear).then(val => {
          if(val){
            this.storage.get('fearDocumentationEntryCollection').then(dEntryCollWADuplicate => {
              let documentationEntryCollection: DocumentationEntry[] = dEntryCollWADuplicate;
              documentationEntryCollection.push(dEntry);
              this.storage.set('fearDocumentationEntryCollection', documentationEntryCollection);
              return true;
            });
          }
        });
      }

      else{
        let fearDocumentationEntryCollection: DocumentationEntry[] = dEntryColl;
        fearDocumentationEntryCollection.push(dEntry);
        this.storage.set('fearDocumentationEntryCollection', fearDocumentationEntryCollection);
        return true;
      }
    }
    return true;
   });

  }
  //delight
  else if(!isFear){

    this.storage.get("delightDocumentationEntryCollection").then(dEntryColl => {
      console.log("dEntryDB_delight saveDocumentationEntry() -> dEntryColl", dEntryColl);
  
      if(dEntryColl == null)
      {
        console.log(dEntry + typeof (dEntry));
        let delightDocumentationEntryCollection: DocumentationEntry[] = [];
        delightDocumentationEntryCollection.push(dEntry);
        this.storage.set(this.delightDocumentationEntryCollection_key, delightDocumentationEntryCollection);
        console.log("storage was empty");
        return true;
      }
  
      else{
        let duplicatedEntry = dEntryColl.find(val => val.entryId == dEntry.entryId)
        console.log("dEntryDB_delight saveDocumentationEntry() -> duplicatedEntry: ", duplicatedEntry)
        if(duplicatedEntry != null)
        {
          console.log("storage-->find dublicate", duplicatedEntry.entryId);
          this.deleteDocumentationEntry(duplicatedEntry.entryId, isFear).then(val => {
            if(val){
              this.storage.get('delightDocumentationEntryCollection').then(dEntryCollWADuplicate => {
                let delightDocumentationEntryCollection: DocumentationEntry[] = dEntryCollWADuplicate;
                delightDocumentationEntryCollection.push(dEntry);
                this.storage.set('delightDocumentationEntryCollection', delightDocumentationEntryCollection);
                return true;
              });
            }
          });
        }
  
        else{
          let delightDocumentationEntryCollection: DocumentationEntry[] = dEntryColl;
          delightDocumentationEntryCollection.push(dEntry);
          this.storage.set('delightDocumentationEntryCollection', delightDocumentationEntryCollection);
          return true;
        }
      }
      return true;
     });

  }

  }

  /**
   * deletes the documentation entry.
   * 
   * @param id - the id of this entry
   * @param isFear - boolean variable for the type of this entry.
   */
  deleteDocumentationEntry(id: number, isFear: boolean): Promise<boolean> {

    //fear entries
    if(isFear)
    {
      return this.storage.get(this.fearDocumentationEntryCollection_key).then((valArr) => {
        let newArr = valArr.filter(val => val.entryId != id); //true -> wird in newArr geschrieben
        this.storage.set(this.fearDocumentationEntryCollection_key, newArr);
        return true;
      });
    }

    //delight entries
    else if(!isFear)
    {
      return this.storage.get(this.delightDocumentationEntryCollection_key).then((valArr) => {
        let newArr = valArr.filter(val => val.entryId != id); //true -> wird in newArr geschrieben
        this.storage.set(this.delightDocumentationEntryCollection_key, newArr);
        return true;
      });
    }

  }

}