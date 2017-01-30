import { Component, OnInit } from '@angular/core';
import * as io from "socket.io-client";
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';
const Highcharts = require('highcharts');

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  websocket: any;
  socket: any;
  temperatureOpts = {};
  lightOpts = {};
  tempChart;
  lightChart;

  constructor() {
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });
  }
    //options: HighchartsOptions;

  ngOnInit() {
      //this.websocket = WebSocketSubject.create("http://localhost:3000/");
      
      /*this.socket = io();    
      this.socket.on('connect', function(){ console.log('connect'); });
      this.socket.on('msg', (data) => { 
          console.log('msg', data); 
          let series = this.tempChart.series[0];
          let dateRecv = new Date(data.resp);
          let date = Date.UTC(
              dateRecv.getFullYear(), dateRecv.getMonth(), dateRecv.getDate(), 
              dateRecv.getHours(), dateRecv.getMinutes(), dateRecv.getSeconds());
          series.addPoint([date, data.value], true, true, true);
          //series.addPoint([dateRecv, data.value], true, true, true);
        });
      this.socket.on('disconnect', function(){ console.log('disconnect'); });*/

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
              type: 'datetime',
              max: + new Date() + 10e4,
              //minTickInterval: 1000 * 60 * 60, //one minute
              //minRange:1000 * 60 * 5,
	          //maxRange:1000 * 60 * 5
              //tickInterval: 50
              //tickInterval: 0.5 * 3600 * 1000,   
              minorTickInterval: 0.1 * 3600 * 1000, 
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
              //pointInterval:  30,
              data: [
                /*[Date.UTC(2017,0,22,0,0,0,0), 26.1], 
                [Date.UTC(2017,0,23,0,0,0,0), 27.2], 
                [Date.UTC(2017,0,24,0,0,0,0), 24.3], 
                [Date.UTC(2017,0,25,0,0,0,0), 23.6],
                [Date.UTC(2017,0,26,0,0,0,0), 22.9], 
                [Date.UTC(2017,0,27,0,0,0,0), 22.4], 
                [Date.UTC(2017,0,28,0,0,0,0), 24.1],
                [Date.UTC(2017,0,29,0,0,0,0), 21.2]*/
                [(new Date()).getTime()-5000, 25],
                [(new Date()).getTime(), 35]
                ]
          }]
      };


      this.lightOpts = {
          chart: {
                type: 'spline',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                /*events: {
                    load: () => {
                        console.log('load light');
                        // set up the updating of the chart each second
                        var series = this.lightChart.series[0];
                        setInterval(() => {
                            var x = (new Date()).getTime(), // current time
                                y = Math.random();
                            series.addPoint([x, y], true, true);
                        }, 1000);
                    }
                }*/
            },
            title: {
                text: 'Live random data'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Random data',
                /*data: (function () {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;

                    for (i = -19; i <= 0; i += 1) {
                        data.push({
                            x: time + i * 1000,
                            y: Math.random()
                        });
                    }
                    return data;
                }())*/
                data: [
                    [{x:(new Date()).getTime(), y:Math.random()}]
                ]
            }]
      };

      this.generateRandomValues();
  }

  saveTempChartReference(chartInstance) {
    this.tempChart = chartInstance;
  }

  saveLightChartReference(chartInstance) {
      this.lightChart = chartInstance;
  }




  generateRandomValues() {
    setInterval(() => {
      let series = this.tempChart.series[0];
      let value = this.getRandomInt(0, 40);
      let dateRecv = new Date();
      let date = Date.UTC(
         dateRecv.getFullYear(), dateRecv.getMonth(), dateRecv.getDate(), 
         dateRecv.getHours(), dateRecv.getMinutes(), dateRecv.getSeconds());

      date = new Date().getTime();
      console.log('>> value: ' + value + ', ' + date);
      //series.addPoint([date, value], true, true);
      
      series.addPoint([(new Date()).getTime(), value], false, true);
      this.tempChart.xAxis[0].update({
        max: + new Date() + 10e3
      },false);
      this.tempChart.redraw();
    }, 2500);



    setInterval(() => {
        // set up the updating of the chart each second
        var lightSerie = this.lightChart.series[0];
        console.log('load light', lightSerie);
        var x = (new Date()).getTime(), // current time
            y = Math.random();
        lightSerie.addPoint([x, y], true, true);
    }, 3000);
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
