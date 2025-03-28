import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTrainingComponent } from './view-training.component';

describe('ViewTrainingComponent', () => {
  let component: ViewTrainingComponent;
  let fixture: ComponentFixture<ViewTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTrainingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
