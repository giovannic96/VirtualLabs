export class Course {
  private _name: string;
  private _acronym: string;
  private _enabled: boolean;
  private _minTeamSize: number;
  private _maxTeamSize: number;

  constructor(name: string, acronym: string, enabled: boolean, minTeamSize: number, maxTeamSize: number) {
    this._name = name;
    this._acronym = acronym;
    this._enabled = enabled;
    this._minTeamSize = minTeamSize;
    this._maxTeamSize = maxTeamSize;
  }

  get name(): string {
    return this._name;
  }

  get acronym(): string {
    return this._acronym;
  }

  get enabled(): boolean {
    return this._enabled;
  }

  get minTeamSize(): number {
    return this._minTeamSize;
  }

  get maxTeamSize(): number {
    return this._maxTeamSize;
  }

  set name(value: string) {
    this._name = value;
  }

  set enabled(value: boolean) {
    this._enabled = value;
  }

  set minTeamSize(value: number) {
    this._minTeamSize = value;
  }

  set maxTeamSize(value: number) {
    this._maxTeamSize = value;
  }

  set acronym(value: string) {
    this._acronym = value;
  }
}
