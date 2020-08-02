import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VmModelSettingsDialogComponent } from './vm-model-settings-dialog.component';

describe('VmModelSettingsDialogComponent', () => {
  let component: VmModelSettingsDialogComponent;
  let fixture: ComponentFixture<VmModelSettingsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VmModelSettingsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmModelSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
