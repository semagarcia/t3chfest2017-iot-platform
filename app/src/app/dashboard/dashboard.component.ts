import { Component, OnInit } from '@angular/core';
const Highcharts = require('highcharts');

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  temperatureOpts = {};

  constructor() {
    this.temperatureOpts = {
        chart: {
              zoomType: 'x',
              height: 200
          },
          title: {
              text: 'History temperature'
          },
          subtitle: {
              text: document.ontouchstart === undefined ?
                      'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
          },
          xAxis: {
              type: 'datetime'
          },
          yAxis: {
              title: {
                  text: 'Exchange rate'
              }
          },
          legend: {
              enabled: false
          },
          plotOptions: {
              area: {
                  fillColor: {
                      linearGradient: {
                          x1: 0,
                          y1: 0,
                          x2: 0,
                          y2: 1
                      },
                      stops: [
                          [0, Highcharts.getOptions().colors[0]],
                          [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                      ]
                  },
                  marker: {
                      radius: 2
                  },
                  lineWidth: 1,
                  states: {
                      hover: {
                          lineWidth: 1
                      }
                  },
                  threshold: null
              }
          },
          //responsive: this.responsiveOptions,

          series: [{
              type: 'area',
              name: 'Temp',
              data: [
                [Date.UTC(2016,2,2), 26.1], 
                [Date.UTC(2016,2,3), 27.2], 
                [Date.UTC(2016,2,4), 24.3], 
                [Date.UTC(2016,2,5), 23.6],
                [Date.UTC(2016,2,6), 22.9], 
                [Date.UTC(2016,2,7), 22.4], 
                [Date.UTC(2016,2,8), 24.1],
                [Date.UTC(2016,2,9), 21.2]]
          }]
      };
  }
    //options: HighchartsOptions;

  ngOnInit() {
  }

}
