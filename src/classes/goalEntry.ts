
export class GoalEntry {

  entryId: number;
  entryDate: string; //here as a string because of the filter in the page.
  entryText: string;
  isAchieved: boolean;

  constructor(entryId: number, entryDate: string, entryText: string, isAchieved: boolean) {
    this.entryId = entryId;
    this.entryDate = entryDate; //"Sat May 04 2019"
    this.entryText = entryText;
    this.isAchieved = isAchieved;

  }

}
