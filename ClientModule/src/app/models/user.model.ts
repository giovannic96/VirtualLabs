export class User {

  private _id: string;
  private _username: string;
  private _password: string;
  private _name: string;
  private _surname: string;
  private _photo: string;
  private _roles: string[];

  constructor(id: string, username: string, password: string, name: string, surname: string,
              photo: string, roles: string[]) {
    this._id = id;
    this._username = username;
    this._password = password;
    this._name = name;
    this._surname = surname;
    this._photo = photo;
    this._roles = roles;
  }

  static sortData(a: User, b: User) {
    // sort data by surname, then name, then id
    if (a.surname.toLowerCase() > b.surname.toLowerCase()) { return 1; }
    if (a.surname.toLowerCase() < b.surname.toLowerCase()) { return -1; }
    if (a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
    if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
    if (a.id.toLowerCase() > b.id.toLowerCase()) { return 1; }
    if (a.id.toLowerCase() < b.id.toLowerCase()) { return -1; }
    return 0;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get surname(): string {
    return this._surname;
  }

  set surname(value: string) {
    this._surname = value;
  }

  get photo(): string {
    return this._photo;
  }

  set photo(value: string) {
    this._photo = value;
  }

  get roles(): string[] {
    return this._roles;
  }

  set roles(value: string[]) {
    this._roles = value;
  }

}
