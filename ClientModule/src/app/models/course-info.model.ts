export class CourseInfo {
  private _name: string;
  private _acronym: string;
  private _minTeamSize: string;
  private _maxTeamSize: string;
  private _description: string;
  private _prerequisites: string;
  private _topics: string;

  constructor(name: string, acronym: string, minTeamSize: string, maxTeamSize: string, description: string,
              prerequisites: string, topics: string) {
    this._name = name;
    this._acronym = acronym;
    this._minTeamSize = minTeamSize;
    this._maxTeamSize = maxTeamSize;
    this._description = description;
    this._prerequisites = prerequisites;
    this._topics = topics;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get acronym(): string {
    return this._acronym;
  }

  set acronym(value: string) {
    this._acronym = value;
  }

  get minTeamSize(): string {
    return this._minTeamSize;
  }

  set minTeamSize(value: string) {
    this._minTeamSize = value;
  }

  get maxTeamSize(): string {
    return this._maxTeamSize;
  }

  set maxTeamSize(value: string) {
    this._maxTeamSize = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get prerequisites(): string {
    return this._prerequisites;
  }

  set prerequisites(value: string) {
    this._prerequisites = value;
  }

  get topics(): string {
    return this._topics;
  }

  set topics(value: string) {
    this._topics = value;
  }
}
