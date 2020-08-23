import {Version} from './version.model';
import {Student} from './student.model';
import {formatDate} from "@angular/common";

export enum ReportStatus {
  NULL = 'NULL',
  READ = 'READ',
  SUBMITTED = 'SUBMITTED',
  REVISED = 'REVISED',
}

export class Report {
  private _id: number;
  private _grade: string;
  private _status: string;
  private _statusDate: string;
  private _versions: Version[];
  private _owner: Student;

  constructor(id: number, grade: string, status: string, statusDate: string) {
    this._id = id;
    this._grade = grade;
    this._status = status;
    this._statusDate = statusDate;
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

  get owner(): Student {
    return this._owner;
  }

  set owner(value: Student) {
    this._owner = value;
  }

  get statusDate(): string {
    return this._statusDate;
  }

  set statusDate(value: string) {
    this._statusDate = value;
  }

  static sortData(a: Report, b: Report) {
    // sort data by statusDate, then owner surname, then owner name, then owner matricola
    if (this.formatDate(a.statusDate).getTime() < this.formatDate(b.statusDate).getTime()) { return 1; }
    if (this.formatDate(a.statusDate).getTime() > this.formatDate(b.statusDate).getTime()) { return -1; }
    if (a.owner.surname.toLowerCase() > b.owner.surname.toLowerCase()) { return 1; }
    if (a.owner.surname.toLowerCase() < b.owner.surname.toLowerCase()) { return -1; }
    if (a.owner.name.toLowerCase() > b.owner.name.toLowerCase()) { return 1; }
    if (a.owner.name.toLowerCase() < b.owner.name.toLowerCase()) { return -1; }
    if (a.owner.id.toLowerCase() > b.owner.id.toLowerCase()) { return 1; }
    if (a.owner.id.toLowerCase() < b.owner.id.toLowerCase()) { return -1; }
    return 0;
  }

  public static formatDate(date: string): Date {
    const splitted = date.toString().split(',').map(s => Number(s));
    return new Date(splitted[0], splitted[1] - 1, splitted[2], splitted[3], splitted[4], splitted[5]);
  }
}
