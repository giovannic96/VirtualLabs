import {Observable} from 'rxjs';
import {Student} from './student.model';
import {Vm} from './vm.model';

export class Team {
  private _id: number;
  private _name: string;
  private _members: Observable<Student[]>;
  private _vms: Observable<Vm[]>;
  private _totCPU: number;
  private _totRAM: number;
  private _totDisk: number;

  constructor(id: number, name: string) {
    this._id = id;
    this._name = name;
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

  get members(): Observable<Student[]> {
    return this._members;
  }

  set members(value: Observable<Student[]>) {
    this._members = value;
  }

  get vms(): Observable<Vm[]> {
    return this._vms;
  }

  set vms(value: Observable<Vm[]>) {
    this._vms = value;
  }

  get totCPU(): number {
    return this._totCPU;
  }

  set totCPU(value: number) {
    this._totCPU = value;
  }

  get totRAM(): number {
    return this._totRAM;
  }

  set totRAM(value: number) {
    this._totRAM = value;
  }

  get totDisk(): number {
    return this._totDisk;
  }

  set totDisk(value: number) {
    this._totDisk = value;
  }
}
