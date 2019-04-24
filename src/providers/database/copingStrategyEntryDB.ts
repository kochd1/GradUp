import { Injectable } from '@angular/core';
// import storage
import { Storage } from '@ionic/storage';

import { DocumentationEntry } from '../../classes/documentationEntry';
 
@Injectable()
export class CopingStrategyEntryDatabaseProvider { 
 
 // coping strategy entry key
 copingStrategyEntryCollection_key: string = 'copingStrategyEntryCollection';

 constructor(public storage: Storage) {
   console.log('Hello CopingStrategyEntryDatabaseProvider Provider');
 }

 /**
  * Gets the coping strategy entry by its id.
  * @param id - id of the coping strategy
  */
 getCopingStrategyEntryById(id: number): Promise<DocumentationEntry> {

     return this.storage.get(this.copingStrategyEntryCollection_key).then((valArr) => {
       return valArr.find(DocumentationEntry => DocumentationEntry.entryId == id);
     });
 }

 /**
  * Saves a coping strategy entry.
  * 
  * @param csEntry 
  */
 saveCopingStrategyEntry(csEntry: DocumentationEntry){

  this.storage.get(this.copingStrategyEntryCollection_key).then(csEntryColl => {
   console.log("csEntryDB_saveCopingStrategyEntry() -> csEntryColl", csEntryColl);

   if(csEntryColl == null)
   {
     console.log(csEntry + typeof (csEntry));
     let copingStrategyEntryCollection: DocumentationEntry[] = [];
     copingStrategyEntryCollection.push(csEntry);
     this.storage.set(this.copingStrategyEntryCollection_key, copingStrategyEntryCollection);
     console.log("storage was empty");
     return true;
   }

   else{
     let duplicatecsEntry = csEntryColl.find(val => val.entryId == csEntry.entryId)
     console.log("saveCopingStrategyEntry() -> duplicatecsEntry: ", duplicatecsEntry)
     if(duplicatecsEntry != null)
     {
       console.log("storage-->find dublicate", duplicatecsEntry.entryId);
       this.deleteCopingStrategyEntry(duplicatecsEntry.entryId).then(val => {
         if(val){
           this.storage.get(this.copingStrategyEntryCollection_key).then(csEntryCollWADuplicate => {
             let copingStrategyEntryCollection: DocumentationEntry[] = csEntryCollWADuplicate;
             copingStrategyEntryCollection.push(csEntry);
             this.storage.set(this.copingStrategyEntryCollection_key, copingStrategyEntryCollection);
             return true;
           });
         }
       });
     }

     else{
       let copingStrategyEntryCollection: DocumentationEntry[] = csEntryColl;
       copingStrategyEntryCollection.push(csEntry);
       this.storage.set(this.copingStrategyEntryCollection_key, copingStrategyEntryCollection);
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
 deleteCopingStrategyEntry(id: number): Promise<boolean> {

     return this.storage.get(this.copingStrategyEntryCollection_key).then((valArr) => {
       let newArr = valArr.filter(val => val.entryId != id); //true -> wird in newArr geschrieben
       this.storage.set(this.copingStrategyEntryCollection_key, newArr);
       return true;
     });

 }

}