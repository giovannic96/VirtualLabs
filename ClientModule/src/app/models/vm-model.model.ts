import {Professor} from './professor.model';

export class VmModel {

  private _id: number;
  private _name: number;
  private _maxVCPU: number;
  private _maxDisk: number;
  private _maxRAM: number;
  private _maxTotVM: number;
  private _maxActiveVM: number;
  private _professor: Professor;

  constructor(id: number, name: number, maxVCPU: number, maxDisk: number,
              maxRAM: number, maxTotVM: number, maxActiveVM: number) {
    this._id = id;
    this._name = name;
    this._maxVCPU = maxVCPU;
    this._maxDisk = maxDisk;
    this._maxRAM = maxRAM;
    this._maxTotVM = maxTotVM;
    this._maxActiveVM = maxActiveVM;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get name(): number {
    return this._name;
  }

  set name(value: number) {
    this._name = value;
  }

  get maxVCPU(): number {
    return this._maxVCPU;
  }

  set maxVCPU(value: number) {
    this._maxVCPU = value;
  }

  get maxDisk(): number {
    return this._maxDisk;
  }

  set maxDisk(value: number) {
    this._maxDisk = value;
  }

  get maxRAM(): number {
    return this._maxRAM;
  }

  set maxRAM(value: number) {
    this._maxRAM = value;
  }

  get maxTotVM(): number {
    return this._maxTotVM;
  }

  set maxTotVM(value: number) {
    this._maxTotVM = value;
  }

  get maxActiveVM(): number {
    return this._maxActiveVM;
  }

  set maxActiveVM(value: number) {
    this._maxActiveVM = value;
  }

  get professor(): Professor {
    return this._professor;
  }

  set professor(value: Professor) {
    this._professor = value;
  }
}
