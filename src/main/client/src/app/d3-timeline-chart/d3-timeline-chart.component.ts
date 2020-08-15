import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as d3 from 'd3';

@Component({
  selector: 'app-d3-timeline-chart',
  templateUrl: './d3-timeline-chart.component.html',
  styleUrls: ['./d3-timeline-chart.component.scss']
})
export class D3TimelineChartComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    var dateFormat = 'YYYY/MM/DD'
    var dateDispFormat = 'M月D日'
    var datetimeFormat = 'YYYY/MM/DD HH:mm:ss'
    var category = ['睡眠', '朝ご飯']
    var datasets = [
      {
        date: moment('2020/08/11'),
        schedule: [
          {
            categoryNo: 0,
            from: moment('2020/08/11 00:00:00'),
            to: moment('2020/08/11 07:00:00')
          },
          {
            categoryNo: 1,
            from: moment('2020/08/11 07:00:00'),
            to: moment('2020/08/11 08:00:00')
          }
        ]
      },
      {
        date: moment('2020/08/12'),
        schedule: [
          {
            categoryNo: 0,
            from: moment('2020/08/12 00:00:00'),
            to: moment('2020/08/12 07:00:00')
          },
        ]
      },
      {
        date: moment('2020/08/13'),
        schedule: [
          {
            categoryNo: 0,
            from: moment('2020/08/13 00:00:00'),
            to: moment('2020/08/13 07:00:00')
          },
        ]
      },
      {
        date: moment('2020/08/14'),
        schedule: [
          {
            categoryNo: 0,
            from: moment('2020/08/14 00:00:00'),
            to: moment('2020/08/14 07:00:00')
          },
        ]
      },
      {
        date: moment('2020/08/15'),
        schedule: [
          {
            categoryNo: 0,
            from: moment('2020/08/15 00:00:00'),
            to: moment('2020/08/15 07:00:00')
          },
        ]
      }
    ]
    var width = 900
    var height = 60
    var padding = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 75
    }
    var barHeight = 20
    var dragIconSize = 15

    var makeRoundTime = function (time) {
      var roundMinutes = '0' + String(Math.round(time.minute() / 5) * 5)
      return moment(time.format('YYYY/MM/DD HH:' + roundMinutes.slice(-2) + ':00:00'))
    }

    datasets.forEach((dataset, index) => {

      var timelineStart = moment(dataset.date.format(dateFormat) + ' 00:00:00', datetimeFormat)
      var timelineEnd = moment(moment(dataset.date).add(1, 'days').format(dateFormat) + ' 00:00:00', datetimeFormat)
      var svg = d3.select('#timeline-chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
      var xScale = d3.scaleTime()
        .domain([timelineStart, timelineEnd])
        .range([padding.left, width - padding.right])
      var zoomedScale = xScale
      var xAxis = d3.axisBottom(xScale)
        .ticks(10)
        .tickSize(-height + padding.top + padding.bottom)
        .tickFormat(d3.timeFormat('%H:%M'))
      var gX = svg.append('g')
        .attr('transform', 'translate(' + 0 + ',' + (height - padding.bottom) + ')')
        .call(xAxis)
      var chartCenterY = padding.top + (height - padding.top - padding.bottom) / 2
      svg.append('text')
        .text(dataset.date.format(dateDispFormat))
        .attr('x', 15)
        .attr('y', chartCenterY)
        .attr('dy', '.5ex')
      var scheduleG = svg.selectAll('.schedule-group-' + index)
        .data(dataset.schedule)
        .enter()
        .append('g')
      var calcScheduleX = function (d) { return zoomedScale(d['from']) }
      var calcScheduleWidth = function (d) { return zoomedScale(d['to']) - zoomedScale(d['from']) }
      var calcToDragIconX = function (d) { return zoomedScale(d['to']) - dragIconSize }
      var calcFromDragIconX = function (d) { return zoomedScale(d['from']) }
      var dragStart = function (d) {
        d3.event.sourceEvent.stopPropagation()
        d3.select(this).classed('dragging', true)
      }
      var dragEnd = function (d) {
        d3.select(this).classed('dragging', false)
        d['from'] = makeRoundTime(d['from'])
        d['to'] = makeRoundTime(d['to'])
        d3.select(this.parentNode)
          .select('rect')
          .attr('x', calcScheduleX)
          .attr('width', calcScheduleWidth)
        d3.select(this.parentNode)
          .select('.to-drag-icon')
          .attr('x', calcToDragIconX)
        d3.select(this.parentNode)
          .select('.from-drag-icon')
          .attr('x', calcFromDragIconX)
      }
      var scheduleDrag = d3.drag()
        .on('start', dragStart)
        .on('drag', function (d) {
          var between = d['to'].diff(d['from'], 'minutes')
          var fromTime = moment(zoomedScale.invert(zoomedScale(d['from']) + d3.event.dx))
          var toTime = moment(fromTime).add(between, 'minutes')

          if (timelineStart.diff(fromTime) > 0) return;
          else if (timelineEnd.diff(toTime) < 0) return;

          d['from'] = fromTime
          d['to'] = toTime
          d3.select(this.parentNode)
            .select('.to-drag-icon')
            .attr('x', calcToDragIconX)
          d3.select(this.parentNode)
            .select('.from-drag-icon')
            .attr('x', calcFromDragIconX)
          d3.select(this).attr('x', calcScheduleX)
        })
        .on('end', dragEnd)
      var schedule = scheduleG.append('rect')
        .attr('x', calcScheduleX)
        .attr('y', chartCenterY - barHeight / 2)
        .attr('width', calcScheduleWidth)
        .attr('height', barHeight)
        .attr('fill', function (d) { return d3.schemeCategory10[d.categoryNo] })
        .style('mix-blend-mode', 'multiply')
        .style('cursor', 'move')
        .call(scheduleDrag)
      var toDrag = d3.drag()
        .on('start', dragStart)
        .on('drag', function (d) {
          var toX = d3.event.x
          var toTime = moment(zoomedScale.invert(toX))

          if (toTime.diff(d['from'], 'minutes') < 5) return
          else if (timelineEnd.diff(toTime, 'minutes') < 0) return

          d['to'] = moment(zoomedScale.invert(toX))
          d3.select(this).attr('x', calcToDragIconX)
          d3.select(this.parentNode)
            .select('rect')
            .attr('width', calcScheduleWidth)
        })
        .on('end', dragEnd)
      var toDragIcon = scheduleG.append('text')
        .text('+')
        .attr('x', calcToDragIconX)
        .attr('y', chartCenterY)
        .attr('dy', '.5ex')
        .attr('fill', 'white')
        .style('font-weight', 'bold')
        .style('cursor', 'col-resize')
        .style('font-size', '1.5rem')
        .classed('to-drag-icon', true)
        .call(toDrag)
      var fromDrag = d3.drag()
        .on('start', dragStart)
        .on('drag', function (d) {
          var fromX = d3.event.x
          var fromTime = moment(zoomedScale.invert(fromX))

          if (fromTime.diff(d['to'], 'minutes') > -5) return
          else if (timelineStart.diff(fromTime, 'minutes') > 0) return

          d['from'] = moment(zoomedScale.invert(fromX))
          d3.select(this).attr('x', calcFromDragIconX)
          d3.select(this.parentNode)
            .select('rect')
            .attr('x', calcScheduleX)
            .attr('width', calcScheduleWidth)
        })
        .on('end', dragEnd)
      var fromDragIcon = scheduleG.append('text')
        .text('+')
        .attr('x', calcFromDragIconX)
        .attr('y', chartCenterY)
        .attr('dy', '.5ex')
        .attr('fill', 'white')
        .style('font-weight', 'bold')
        .style('cursor', 'col-resize')
        .style('font-size', '1.5rem')
        .classed('from-drag-icon', true)
        .call(fromDrag)
      var zoomed = function () {
        zoomedScale = d3.event.transform.rescaleX(xScale)
        gX.call(xAxis.scale(zoomedScale))
        schedule.attr('x', calcScheduleX)
          .attr('width', calcScheduleWidth)
        toDragIcon.attr('x', calcToDragIconX)
        fromDragIcon.attr('x', calcFromDragIconX)
      }
      var zoom = d3.zoom()
        .scaleExtent([1, 20])
        .translateExtent([[0, 0], [width, 0]])
        .on('zoom', zoomed)
      svg.call(zoom)
    })
  }
}