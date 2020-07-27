import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseContComponent } from './course-cont.component';

describe('UserContComponent', () => {
  let component: CourseContComponent;
  let fixture: ComponentFixture<CourseContComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseContComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseContComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
