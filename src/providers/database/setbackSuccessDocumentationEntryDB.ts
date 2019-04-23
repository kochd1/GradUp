import { Injectable } from '@angular/core';
// import storage
import { Storage } from '@ionic/storage';

import { SetbackSuccessDocumentationEntry } from '../../classes/setbacksuccessdocumentationEntry';

@Injectable()
export class SetbackSuccessDocumentationEntryDatabaseProvider {

  // setback documentation entry key
  setbackDocumentationEntryCollection_key: string = 'setbackDocumentationEntryCollection';

  // success documentation entry key
  successDocumentationEntryCollection_key: string = 'successDocumentationEntryCollection';

  constructor(public storage: Storage) {
    console.log('Hello DocumentationEntryDatabaseProvider Provider');
  }

  /**
   * Gets the document entry by its id.
   * @param id - id of the document
   */
  getDocumentationEntryById(id: number, isSetbackEntry: boolean): Promise<SetbackSuccessDocumentationEntry> {

    //setback entry
    if(isSetbackEntry)
    {
      return this.storage.get(this.setbackDocumentationEntryCollection_key).then((valArr) => {
        return valArr.find(DocumentationEntry => DocumentationEntry.entryId == id);
      });
    }

    //success entry
    else if(!isSetbackEntry)
    {
      return this.storage.get(this.successDocumentationEntryCollection_key).then((valArr) => {
        return valArr.find(DocumentationEntry => DocumentationEntry.entryId == id);
      });
    }
    
  }

  /**
   * saves a  documentation entry (setback or success).
   * 
   * @param dEntry 
   */
  saveDocumentationEntry(dEntry: SetbackSuccessDocumentationEntry, isSetbackEntry: boolean){
  console.log("DB -> isSetbackEntry: ", isSetbackEntry);
  //setback
  if(isSetbackEntry)
  {
   this.storage.get("setbackDocumentationEntryCollection").then(dEntryColl => {
    console.log("dEntryDB_setback saveDocumentationEntry() -> dEntryColl", dEntryColl);

    if(dEntryColl == null)
    {
      console.log(dEntry + typeof (dEntry));
      let setbackDocumentationEntryCollection: SetbackSuccessDocumentationEntry[] = [];
      setbackDocumentationEntryCollection.push(dEntry);
      this.storage.set(this.setbackDocumentationEntryCollection_key, setbackDocumentationEntryCollection);
      console.log("storage was empty");
      return true;
    }

    else{
      let duplicatedEntry = dEntryColl.find(val => val.entryId == dEntry.entryId)
      console.log("saveDocumentationEntry() -> duplicatedEntry: ", duplicatedEntry)
      if(duplicatedEntry != null)
      {
        console.log("storage-->find dublicate", duplicatedEntry.entryId);
        this.deleteDocumentationEntry(duplicatedEntry.entryId, isSetbackEntry).then(val => {
          if(val){
            this.storage.get('setbackDocumentationEntryCollection').then(dEntryCollWADuplicate => {
              let documentationEntryCollection: SetbackSuccessDocumentationEntry[] = dEntryCollWADuplicate;
              documentationEntryCollection.push(dEntry);
              this.storage.set('setbackDocumentationEntryCollection', documentationEntryCollection);
              return true;
            });
          }
        });
      }

      else{
        let setbackDocumentationEntryCollection: SetbackSuccessDocumentationEntry[] = dEntryColl;
        setbackDocumentationEntryCollection.push(dEntry);
        this.storage.set('setbackDocumentationEntryCollection', setbackDocumentationEntryCollection);
        return true;
      }
    }
    return true;
   });

  }
  //success
  else if(!isSetbackEntry){

    this.storage.get("successDocumentationEntryCollection").then(dEntryColl => {
      console.log("dEntryDB_success saveDocumentationEntry() -> dEntryColl", dEntryColl);
  
      if(dEntryColl == null)
      {
        console.log(dEntry + typeof (dEntry));
        let successDocumentationEntryCollection: SetbackSuccessDocumentationEntry[] = [];
        successDocumentationEntryCollection.push(dEntry);
        this.storage.set(this.successDocumentationEntryCollection_key, successDocumentationEntryCollection);
        console.log("storage was empty");
        return true;
      }
  
      else{
        let duplicatedEntry = dEntryColl.find(val => val.entryId == dEntry.entryId)
        console.log("dEntryDB_success saveDocumentationEntry() -> duplicatedEntry: ", duplicatedEntry)
        if(duplicatedEntry != null)
        {
          console.log("storage-->find dublicate", duplicatedEntry.entryId);
          this.deleteDocumentationEntry(duplicatedEntry.entryId, isSetbackEntry).then(val => {
            if(val){
              this.storage.get('successDocumentationEntryCollection').then(dEntryCollWADuplicate => {
                let successDocumentationEntryCollection: SetbackSuccessDocumentationEntry[] = dEntryCollWADuplicate;
                successDocumentationEntryCollection.push(dEntry);
                this.storage.set('successDocumentationEntryCollection', successDocumentationEntryCollection);
                return true;
              });
            }
          });
        }
  
        else{
          let successDocumentationEntryCollection: SetbackSuccessDocumentationEntry[] = dEntryColl;
          successDocumentationEntryCollection.push(dEntry);
          this.storage.set('successDocumentationEntryCollection', successDocumentationEntryCollection);
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
   * @param isSetbackEntry - boolean variable for the type of this entry.
   */
  deleteDocumentationEntry(id: number, isSetbackEntry: boolean): Promise<boolean> {

    //setback entries
    if(isSetbackEntry)
    {
      return this.storage.get(this.setbackDocumentationEntryCollection_key).then((valArr) => {
        let newArr = valArr.filter(val => val.entryId != id); //true -> wird in newArr geschrieben
        this.storage.set(this.setbackDocumentationEntryCollection_key, newArr);
        return true;
      });
    }

    //success entries
    else if(!isSetbackEntry)
    {
      return this.storage.get(this.successDocumentationEntryCollection_key).then((valArr) => {
        let newArr = valArr.filter(val => val.entryId != id); //true -> wird in newArr geschrieben
        this.storage.set(this.successDocumentationEntryCollection_key, newArr);
        return true;
      });
    }

  }

}