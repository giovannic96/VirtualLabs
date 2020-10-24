export class Token {
  private _username: string;
  private _iat: number;
  private _exp: number;
  private _sub: string;
  private _roles: string[];

  constructor(username: string, roles: string[], iat: number, exp: number, sub: string) {
    this._username = username;
    this._iat = iat;
    this._exp = exp;
    this._sub = sub;
  }

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get iat(): number {
    return this._iat;
  }

  set iat(value: number) {
    this._iat = value;
  }

  get exp(): number {
    return this._exp;
  }

  set exp(value: number) {
    this._exp = value;
  }

  get sub(): string {
    return this._sub;
  }

  set sub(value: string) {
    this._sub = value;
  }

  get roles(): string[] {
    return this._roles;
  }

  set roles(value: string[]) {
    this._roles = value;
  }
}
