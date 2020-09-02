import {Student} from './student.model';

export enum TeamProposalStatus {
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  CONFIRMED = 'CONFIRMED'
}

export class TeamProposal {

  private _id: number;
  private _expiryDate: string;
  private _teamName: string;
  private _status: string;
  private _statusDesc: string;
  private _creatorId: string;
  private _members: Student[];
  private _creator: Student;

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get expiryDate(): string {
    return this._expiryDate;
  }

  set expiryDate(value: string) {
    this._expiryDate = value;
  }

  get teamName(): string {
    return this._teamName;
  }

  set teamName(value: string) {
    this._teamName = value;
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }

  get statusDesc(): string {
    return this._statusDesc;
  }

  set statusDesc(value: string) {
    this._statusDesc = value;
  }

  get creatorId(): string {
    return this._creatorId;
  }

  set creatorId(value: string) {
    this._creatorId = value;
  }

  get members(): Student[] {
    return this._members;
  }

  set members(value: Student[]) {
    this._members = value;
  }

  get creator(): Student {
    return this._creator;
  }

  set creator(value: Student) {
    this._creator = value;
  }

}
