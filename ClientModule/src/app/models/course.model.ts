export class Course {
  private _name: string;
  private _acronym: string;
  private _enabled: boolean;
  private _minTeamSize: number;
  private _maxTeamSize: number;
  private _info: string;
  links: {rel, href}[];

  constructor(name: string, acronym: string, enabled: boolean, minTeamSize: number, maxTeamSize: number, info: string) {
    this._name = name;
    this._acronym = acronym;
    this._enabled = enabled;
    this._minTeamSize = minTeamSize;
    this._maxTeamSize = maxTeamSize;
    this._info = info;
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

  get enabled(): boolean {
    return this._enabled;
  }

  set enabled(value: boolean) {
    this._enabled = value;
  }

  get minTeamSize(): number {
    return this._minTeamSize;
  }

  set minTeamSize(value: number) {
    this._minTeamSize = value;
  }

  get maxTeamSize(): number {
    return this._maxTeamSize;
  }

  set maxTeamSize(value: number) {
    this._maxTeamSize = value;
  }

  get info(): string {
    return this._info;
  }

  set info(value: string) {
    this._info = value;
  }
}
