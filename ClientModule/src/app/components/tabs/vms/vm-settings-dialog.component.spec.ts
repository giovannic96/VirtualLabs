import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VmSettingsDialogComponent } from './vm-settings-dialog.component';

describe('VmSettingsDialogComponent', () => {
  let component: VmSettingsDialogComponent;
  let fixture: ComponentFixture<VmSettingsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VmSettingsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
