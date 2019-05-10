
export class GoalEntry {

  entryId: number;
  entryDate: Date;
  entryText: string;
  isRepetitive: boolean;
  isAchieved: boolean;

  constructor(entryId: number, entryDate: Date, entryText: string, isRepetitive: boolean, isAchieved: boolean) {
    this.entryId = entryId; // test -> new Date().getTime() - 604800000;
    this.entryDate = entryDate;
    this.entryText = entryText;
    this.isRepetitive = isRepetitive;
    this.isAchieved = isAchieved;

  }

}
