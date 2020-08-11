import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { D3TimelineChartComponent } from './d3-timeline-chart/d3-timeline-chart.component';

const routes: Routes = [
  { path: 'd3-timeline-chart', component: D3TimelineChartComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
