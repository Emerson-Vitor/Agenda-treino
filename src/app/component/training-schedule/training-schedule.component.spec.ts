import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingScheduleComponent } from './training-schedule.component';

describe('TrainingScheduleComponent', () => {
  let component: TrainingScheduleComponent;
  let fixture: ComponentFixture<TrainingScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
