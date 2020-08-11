import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3TimelineChartComponent } from './d3-timeline-chart.component';

describe('D3TimelineChartComponent', () => {
  let component: D3TimelineChartComponent;
  let fixture: ComponentFixture<D3TimelineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3TimelineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3TimelineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
