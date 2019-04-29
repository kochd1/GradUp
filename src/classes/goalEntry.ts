
export class GoalEntry {

  entryId: number;
  entryDate: Date;
  entryText: string;
  isAchieved: boolean;

  constructor(entryId: number, entryDate: Date, entryText: string, isAchieved: boolean) {
    this.entryId = entryId;
    this.entryDate = entryDate;
    this.entryText = entryText;
    this.isAchieved = isAchieved;

  }

}
