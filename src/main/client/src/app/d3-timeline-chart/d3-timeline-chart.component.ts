import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-d3-timeline-chart',
  templateUrl: './d3-timeline-chart.component.html',
  styleUrls: ['./d3-timeline-chart.component.scss']
})
export class D3TimelineChartComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    d3.select('#timeline-chart').append('d').text('Hello!')
  }

}
