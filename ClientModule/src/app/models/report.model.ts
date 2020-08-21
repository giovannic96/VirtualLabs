import {Version} from './version.model';

export class Report {
  private _id: number;
  private _grade: string;
  private _status: string;
  private _versions: Version[];

  constructor(id: number, grade: string, status: string) {
    this._id = id;
    this._grade = grade;
    this._status = status;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get grade(): string {
    return this._grade;
  }

  set grade(value: string) {
    this._grade = value;
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }

  get versions(): Version[] {
    return this._versions;
  }

  set versions(value: Version[]) {
    this._versions = value;
  }
}
