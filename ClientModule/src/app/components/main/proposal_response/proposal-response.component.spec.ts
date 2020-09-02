import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalResponseComponent } from './proposal-response.component';

describe('ProposalResponseComponent', () => {
  let component: ProposalResponseComponent;
  let fixture: ComponentFixture<ProposalResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposalResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
