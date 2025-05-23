export interface BallotBinder {
  UserId: string;
  ElectionAccessCode: string;
  BallotId: string;
  ElectionId: string;
  DateCreated: Date;
  DateUpdated: Date;
}

export class BallotBinderStorage {
  private storageKey = 'ballotBinders';

  constructor(private _userId: string) {}

  private saveBallotBinders(ballotBinders: BallotBinder[]): void {
    const serialized = JSON.stringify(ballotBinders, (key, value) => {
      if (key === 'DateCreated' || key === 'DateUpdated') {
        return value instanceof Date ? value.toISOString() : value;
      }
      return value;
    });
    localStorage.setItem(this.storageKey, serialized);
  }

  private loadBallotBinders(): BallotBinder[] {
    const serialized = localStorage.getItem(this.storageKey);
    if (!serialized) return [];

    return JSON.parse(serialized, (key, value) => {
      if (key === 'DateCreated' || key === 'DateUpdated') {
        return value ? new Date(value) : null;
      }
      return value;
    });
  }

  addOrUpdateBallotBinder(
    electionAccessCode: string,
    ballotId: string,
    electionId: string,
  ): BallotBinder {
    let ballotBinders = this.loadBallotBinders();
    const existingIndex = ballotBinders.findIndex(
      (binder) =>
        binder.ElectionAccessCode === electionAccessCode && binder.UserId === this._userId,
    );

    const now = new Date();
    let ballotBinder: BallotBinder;

    if (existingIndex === -1) {
      // Insert new ballot binder
      ballotBinder = {
        UserId: this._userId,
        ElectionAccessCode: electionAccessCode,
        BallotId: ballotId,
        ElectionId: electionId,
        DateCreated: now,
        DateUpdated: now,
      };
      ballotBinders.push(ballotBinder);
    } else {
      // Update existing ballot binder
      ballotBinder = {
        ...ballotBinders[existingIndex],
        BallotId: ballotId,
        DateUpdated: now,
      };
      ballotBinders[existingIndex] = ballotBinder;
    }

    this.saveBallotBinders(ballotBinders);
    return ballotBinder;
  }

  getBallotBinderbyEAC(electionAccessCode: string): BallotBinder | undefined {
    const ballotBinders = this.loadBallotBinders();
    return ballotBinders.find(
      (binder) =>
        binder.ElectionAccessCode === electionAccessCode && binder.UserId === this._userId,
    );
  }

  getBallotBinderbyElectionId(electionId: string): BallotBinder | undefined {
    const ballotBinders = this.loadBallotBinders();
    return ballotBinders.find(
      (binder) => binder.ElectionId === electionId && binder.UserId === this._userId,
    );
  }
  removeBallotBinder(electionAccessCode: string): void {
    let ballotBinders = this.loadBallotBinders();
    ballotBinders = ballotBinders.filter(
      (binder) =>
        !(binder.ElectionAccessCode === electionAccessCode && binder.UserId === this._userId),
    );
    this.saveBallotBinders(ballotBinders);
  }

  getAllBallotBinders(): BallotBinder[] {
    return this.loadBallotBinders().filter((binder) => binder.UserId === this._userId);
  }
}
