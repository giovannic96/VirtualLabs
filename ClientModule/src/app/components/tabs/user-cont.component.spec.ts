import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserContComponent } from './user-cont.component';

describe('UserContComponent', () => {
  let component: UserContComponent;
  let fixture: ComponentFixture<UserContComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserContComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserContComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
