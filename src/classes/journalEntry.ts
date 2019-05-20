import { convertUrlToDehydratedSegments } from "ionic-angular/umd/navigation/url-serializer";

export class JournalEntry {

  entryId: number;
  entryDate: string; //string because of IONIC (ion-datetime) and ISO 8601
  entryText: string;
  entryPhoto: any;
  entrySubjCondition: number;
  entryMoodReason: string;


  constructor() {
    this.entryDate = "";
    this.entryText = "";
    this.entryPhoto = "";
    this.entrySubjCondition;
    this.entryMoodReason = "";

    //does not work! -> work around in journal-entry.ts
    this.entryId = 0; //this.entryDate.getTime(); //sets the amount of milliseconds since 1970 as id
  }

}
