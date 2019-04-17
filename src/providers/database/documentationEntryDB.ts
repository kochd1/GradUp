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

}