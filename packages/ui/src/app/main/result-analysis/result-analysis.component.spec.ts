import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultAnalysisComponent } from './result-analysis.component';

describe('ResultAnalysisComponent', () => {
  let component: ResultAnalysisComponent;
  let fixture: ComponentFixture<ResultAnalysisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResultAnalysisComponent]
    });
    fixture = TestBed.createComponent(ResultAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
