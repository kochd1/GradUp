
export class GoalEntry {

  entryId: number;
  entryDate: Date;
  entryText: string;
  isRepetitive: boolean;
  isAchieved: boolean;

  constructor(entryId: number, entryDate: Date, entryText: string, isRepetitive: boolean, isAchieved: boolean) {
    this.entryId = entryId;
    this.entryDate = entryDate;
    this.entryText = entryText;
    this.isRepetitive = isRepetitive;
    this.isAchieved = isAchieved;

  }

}
