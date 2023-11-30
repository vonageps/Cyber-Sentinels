import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupScreenComponent } from './setup-screen.component';

describe('SetupScreenComponent', () => {
  let component: SetupScreenComponent;
  let fixture: ComponentFixture<SetupScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SetupScreenComponent]
    });
    fixture = TestBed.createComponent(SetupScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
