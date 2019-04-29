import { Injectable } from '@angular/core';
// import storage
import { Storage } from '@ionic/storage';

import { GoalEntry } from '../../classes/goalEntry';

@Injectable()
export class GoalEntryDatabaseProvider {

  // daily goal entry key
  dailyGoalEntryCollection_key: string = 'dailyGoalEntryCollection';

  // weekly goal entry key
  weeklyGoalEntryCollection_key: string = 'weeklyGoalEntryCollection';

  //goal entry archive key
  goalEntryArchiveCollection_key: string = 'goalEntryArchiveCollection'

  constructor(public storage: Storage) {
    console.log('Hello GoalEntryDatabaseProvider Provider');
  }

  /**
   * Gets the goal entry by its id.
   * @param id - id of the goal
   */
  getGoalEntryById(id: number, isDailyGoal: boolean): Promise<GoalEntry> {

    //daily goal entry
    if (isDailyGoal) {
      return this.storage.get(this.dailyGoalEntryCollection_key).then((valArr) => {
        return valArr.find(GoalEntry => GoalEntry.entryId == id);
      });
    }

    //weekly goal entry
    else if (!isDailyGoal) {
      return this.storage.get(this.weeklyGoalEntryCollection_key).then((valArr) => {
        return valArr.find(GoalEntry => GoalEntry.entryId == id);
      });
    }

  }

  /**
   * saves a  goal entry (daily goal or weekly goal).
   *
   * @param gEntry
   */
  saveGoalEntry(gEntry: GoalEntry, isDailyGoal: boolean) {
    console.log("DB -> isDailyGoal: ", isDailyGoal);
    //daily goal
    if (isDailyGoal) {
      this.storage.get(this.dailyGoalEntryCollection_key).then(gEntryColl => {
        console.log("gEntryDB_daily goal saveGoalEntry() -> gEntryColl", gEntryColl);

        if (gEntryColl == null) {
          console.log(gEntry + typeof (gEntry));
          let dailyGoalEntryCollection: GoalEntry[] = [];
          dailyGoalEntryCollection.push(gEntry);
          this.storage.set(this.dailyGoalEntryCollection_key, dailyGoalEntryCollection);
          console.log("storage was empty");
          return true;
        }

        else {
          let duplicatedEntry = gEntryColl.find(val => val.entryId == gEntry.entryId)
          console.log("saveGoalEntry() -> duplicatedEntry: ", duplicatedEntry)
          if (duplicatedEntry != null) {
            console.log("storage-->find duplicate", duplicatedEntry.entryId);
            this.deleteGoalEntry(duplicatedEntry.entryId, isDailyGoal).then(val => {
              if (val) {
                this.storage.get(this.dailyGoalEntryCollection_key).then(dEntryCollWADuplicate => {
                  let goalEntryCollection: GoalEntry[] = dEntryCollWADuplicate;
                  goalEntryCollection.push(gEntry);
                  this.storage.set(this.dailyGoalEntryCollection_key, goalEntryCollection);
                  return true;
                });
              }
            });
          }

          else {
            let dailyGoalEntryCollection: GoalEntry[] = gEntryColl;
            dailyGoalEntryCollection.push(gEntry);
            this.storage.set(this.dailyGoalEntryCollection_key, dailyGoalEntryCollection);
            return true;
          }
        }
        return true;
      });

    }
    //weekly Goal
    else if (!isDailyGoal) {

      this.storage.get(this.weeklyGoalEntryCollection_key).then(gEntryColl => {
        console.log("dEntryDB_weekly goal saveGoalEntry() -> dEntryColl", gEntryColl);

        if (gEntryColl == null) {
          console.log(gEntry + typeof (gEntry));
          let weeklyGoalEntryCollection: GoalEntry[] = [];
          weeklyGoalEntryCollection.push(gEntry);
          this.storage.set(this.weeklyGoalEntryCollection_key, weeklyGoalEntryCollection);
          console.log("storage was empty");
          return true;
        }

        else {
          let duplicatedEntry = gEntryColl.find(val => val.entryId == gEntry.entryId)
          console.log("dEntryDB_weekly goal saveDocumentationEntry() -> duplicatedEntry: ", duplicatedEntry)
          if (duplicatedEntry != null) {
            console.log("storage-->find dublicate", duplicatedEntry.entryId);
            this.deleteGoalEntry(duplicatedEntry.entryId, isDailyGoal).then(val => {
              if (val) {
                this.storage.get(this.weeklyGoalEntryCollection_key).then(dEntryCollWADuplicate => {
                  let weeklyGoalEntryCollection: GoalEntry[] = dEntryCollWADuplicate;
                  weeklyGoalEntryCollection.push(gEntry);
                  this.storage.set(this.weeklyGoalEntryCollection_key, weeklyGoalEntryCollection);
                  return true;
                });
              }
            });
          }

          else {
            let weeklyGoalEntryCollection: GoalEntry[] = gEntryColl;
            weeklyGoalEntryCollection.push(gEntry);
            this.storage.set(this.weeklyGoalEntryCollection_key, weeklyGoalEntryCollection);
            return true;
          }
        }
        return true;
      });

    }

  }

  /**
   * Archives the goal entry.
   *
   * @param gEntry - entry to archive
   */
  archiveGoalEntry(gEntry: GoalEntry) {

    this.storage.get(this.goalEntryArchiveCollection_key).then(gEntryArchiveColl => {
      console.log("gEntryDB_ archiveGoalEntry() -> gEntryColl", gEntryArchiveColl);

      if (gEntryArchiveColl == null) {
        console.log(gEntry + typeof (gEntry));
        let goalEntryArchiveCollection: GoalEntry[] = [];
        goalEntryArchiveCollection.push(gEntry);
        this.storage.set(this.goalEntryArchiveCollection_key, goalEntryArchiveCollection);
        console.log("goal archived");
        console.log("goal archive was empty");
        return true;
      }

      else {
        let goalEntryArchiveCollection: GoalEntry[] = gEntryArchiveColl;
        goalEntryArchiveCollection.push(gEntry);
        this.storage.set(this.goalEntryArchiveCollection_key, goalEntryArchiveCollection);
        console.log("goal archived");
        console.log("goal archive was filled");
        return true;

      }

    });

  }

  /**
   * deletes the goal entry.
   *
   * @param id - the id of this entry
   * @param isDailyGoal - boolean variable for the type of this entry.
   */
  deleteGoalEntry(id: number, isDailyGoal: boolean): Promise<boolean> {

    //daily goal entries
    if (isDailyGoal) {
      return this.storage.get(this.dailyGoalEntryCollection_key).then((valArr) => {
        let newArr = valArr.filter(val => val.entryId != id); //true -> wird in newArr geschrieben
        this.storage.set(this.dailyGoalEntryCollection_key, newArr);
        return true;
      });
    }

    //weekly goal entries
    else if (!isDailyGoal) {
      return this.storage.get(this.weeklyGoalEntryCollection_key).then((valArr) => {
        let newArr = valArr.filter(val => val.entryId != id); //true -> wird in newArr geschrieben
        this.storage.set(this.weeklyGoalEntryCollection_key, newArr);
        return true;
      });
    }

  }

}
