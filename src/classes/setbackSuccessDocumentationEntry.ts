export class SetbackSuccessDocumentationEntry{

  entryId: number;
  entryDate: Date;
  entrySubjectText: string;
  entryReasonText: string;
  
    constructor(entryId: number, entryDate: Date, entrySubjectText: string, entryReasonText: string){
      this.entryId = entryId;
      this.entryDate = entryDate;
      this.entrySubjectText = entrySubjectText;
      this.entryReasonText = entryReasonText;
    }
  
  }