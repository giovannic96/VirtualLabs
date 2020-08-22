import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualDesktopComponent } from './virtual-desktop.component';

describe('VirtualDesktopComponent', () => {
  let component: VirtualDesktopComponent;
  let fixture: ComponentFixture<VirtualDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
