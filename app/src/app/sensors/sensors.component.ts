import { Component, OnInit } from '@angular/core';
const Highcharts = require('highcharts');
const HighchartsMore = require('highcharts-more')(Highcharts);
const HCSoldGauge = require('highcharts/modules/solid-gauge')(Highcharts);
//require('highcharts/modules/exporting')(Highcharts);

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.css']
})
export class SensorsComponent implements OnInit {

  potentiometer = {};
  gaugeOptions = {};
  gaugeOptions2 = {};
  chart;

  constructor() { 
    this.gaugeOptions = {
        chart: {
            type: 'solidgauge',
            height: 200
        },
        title: null,
        pane: {
            center: ['50%', '85%'],
            size: '140%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },
        tooltip: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        yAxis: {
            stops: [
                [0.1, '#55BF3B'], // green
                [0.5, '#DDDF0D'], // yellow
                [0.9, '#DF5353'] // red
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickAmount: 0,
            min: 0,
            max: 200,
            title: {
                y: -70,
                text: 'Speed'
            },
            labels: {
                y: 16
            }
        },
        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        },
        series: [{
            name: 'Speed',
            data: [140],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                       '<span style="font-size:12px;color:silver">km/h</span></div>'
            },
            tooltip: {
                valueSuffix: ' km/h'
            }
        }]
    };
  }

  ngOnInit() {
  }

  saveChartReference(chartInstance) {
    this.chart = chartInstance;
  }

  generateRandomValues() {
    setInterval(() => {
      let point = this.chart.series[0].points[0];
      point.update(this.getRandomInt(0, 200));
    }, 5000);
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
