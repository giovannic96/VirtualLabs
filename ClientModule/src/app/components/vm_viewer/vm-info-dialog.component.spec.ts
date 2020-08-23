import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VmInfoDialogComponent } from './vm-info-dialog.component';

describe('VmSettingsDialogComponent', () => {
  let component: VmInfoDialogComponent;
  let fixture: ComponentFixture<VmInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VmInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
