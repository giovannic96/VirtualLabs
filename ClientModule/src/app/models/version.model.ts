export class Version {
  private _id: number;
  private _title: string;
  private _content: string;
  private _review: string;
  private _revised: boolean;
  private _submissionDate: string;

  constructor(id: number, title: string, content: string, submissionDate: string) {
    this._id = id;
    this._title = title;
    this._content = content;
    this._submissionDate = submissionDate;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get content(): string {
    return this._content;
  }

  set content(value: string) {
    this._content = value;
  }

  get review(): string {
    return this._review;
  }

  set review(value: string) {
    this._review = value;
  }

  get revised(): boolean {
    return this._revised;
  }

  set revised(value: boolean) {
    this._revised = value;
  }

  get submissionDate(): string {
    return this._submissionDate;
  }

  set submissionDate(value: string) {
    this._submissionDate = value;
  }
}
