import {Student} from './student.model';

export class Vm {
  private _id: number;
  private _active: boolean;
  private _vcpu: number;
  private _ram: number;
  private _disk: number;
  private _content: string;
  private _creator: Student;
  private _owners: Student[];

  get creator(): Student {
    return this._creator;
  }

  set creator(value: Student) {
    this._creator = value;
  }

  get owners(): Student[] {
    return this._owners;
  }

  set owners(value: Student[]) {
    this._owners = value;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get active(): boolean {
    return this._active;
  }

  set active(value: boolean) {
    this._active = value;
  }

  get vcpu(): number {
    return this._vcpu;
  }

  set vcpu(value: number) {
    this._vcpu = value;
  }

  get ram(): number {
    return this._ram;
  }

  set ram(value: number) {
    this._ram = value;
  }

  get disk(): number {
    return this._disk;
  }

  set disk(value: number) {
    this._disk = value;
  }

  get content(): string {
    return this._content;
  }

  set content(value: string) {
    this._content = value;
  }

  getDTO() {
    return {
      vcpu: this._vcpu,
      ram: this._ram,
      disk: this._disk
    };
  }
}
