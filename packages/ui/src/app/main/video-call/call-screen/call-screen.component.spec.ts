import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallScreenComponent } from './call-screen.component';

describe('CallScreenComponent', () => {
  let component: CallScreenComponent;
  let fixture: ComponentFixture<CallScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CallScreenComponent]
    });
    fixture = TestBed.createComponent(CallScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
