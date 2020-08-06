import {Professor} from './professor.model';

export class VmModel {

  private _id: number;
  private _name: number;
  private _os: string;
  private _maxVCPU: number;
  private _maxDisk: number;
  private _maxRAM: number;
  private _maxTotVm: number;
  private _maxActiveVm: number;
  private _professor: Professor;

  constructor(id: number, name: number, os: string, maxVCPU: number, maxRAM: number,
              maxDisk: number, maxTotVm: number, maxActiveVm: number) {
    this._id = id;
    this._name = name;
    this._os = os;
    this._maxVCPU = maxVCPU;
    this._maxDisk = maxDisk;
    this._maxRAM = maxRAM;
    this._maxTotVm = maxTotVm;
    this._maxActiveVm = maxActiveVm;
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

  get os(): string {
    return this._os;
  }

  set os(value: string) {
    this._os = value;
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

  get maxTotVm(): number {
    return this._maxTotVm;
  }

  set maxTotVm(value: number) {
    this._maxTotVm = value;
  }

  get maxActiveVm(): number {
    return this._maxActiveVm;
  }

  set maxActiveVm(value: number) {
    this._maxActiveVm = value;
  }

  get professor(): Professor {
    return this._professor;
  }

  set professor(value: Professor) {
    this._professor = value;
  }

  getDTO(): any {
    return {
      name: this.name,
      os: this.os,
      maxVCPU: this.maxVCPU,
      maxRAM: this.maxRAM,
      maxDisk: this.maxDisk,
      maxTotVm: this.maxTotVm,
      maxActiveVm: this.maxActiveVm
    };
  }
}
