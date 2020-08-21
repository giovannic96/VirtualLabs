import {Report} from './report.model';

export class Assignment {
  private _id: number;
  private _name: string;
  private _releaseDate: string;
  private _expiryDate: string;
  private _content: string;
  private _reports: Report[];

  constructor(id: number, name: string, releaseDate: string, expiryDate: string, content: string) {
    this._id = id;
    this._name = name;
    this._releaseDate = releaseDate;
    this._expiryDate = expiryDate;
    this._content = content;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get releaseDate(): string {
    return this._releaseDate;
  }

  set releaseDate(value: string) {
    this._releaseDate = value;
  }

  get expiryDate(): string {
    return this._expiryDate;
  }

  set expiryDate(value: string) {
    this._expiryDate = value;
  }

  get content(): string {
    return this._content;
  }

  set content(value: string) {
    this._content = value;
  }

  get reports(): Report[] {
    return this._reports;
  }

  set reports(value: Report[]) {
    this._reports = value;
  }
}
