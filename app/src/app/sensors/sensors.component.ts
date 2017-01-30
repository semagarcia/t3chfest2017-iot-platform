import { Component, OnInit, ViewChild } from '@angular/core';
const Highcharts = require('highcharts');
const HighchartsMore = require('highcharts-more')(Highcharts);
const HCSoldGauge = require('highcharts/modules/solid-gauge')(Highcharts);
//require('highcharts/modules/exporting')(Highcharts);

import { AlertComponent } from './../shared/alert.component';

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
  switcherStatusImg;
  buzzerStatusImg;
  alertBodyMessage;
  @ViewChild(AlertComponent) alert;

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
      this.switcherStatusImg = './../../assets/icon_switch_on.jpg';
      this.buzzerStatusImg = './../../assets/icon_speaker_off.png';
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

  switcherClicked() {
      this.switcherStatusImg = (this.switcherStatusImg.indexOf('_on.') !== -1) 
        ? this.switcherStatusImg.replace('_on.', '_off.')
        : this.switcherStatusImg.replace('_off.', '_on.');
  }

  buzzerClicked() {
      this.buzzerStatusImg = (this.buzzerStatusImg.indexOf('_on.') !== -1) 
        ? this.buzzerStatusImg.replace('_on.', '_off.')
        : this.buzzerStatusImg.replace('_off.', '_on.');
  }


  
  openAlert(alertToRender) {
    /*this.alert.alertFooter = true;
    this.alert.cancelButton = true;
    this.alert.okButton = false;
    this.alert.alertHeader = true;
    this.alert.alertTitle = "A simple Alert modal window";
    this.alert.message = "It is a classic Alert modal with title, body, footer.";
    this.alert.cancelButtonText = "Ok, Got it.";
    this.alert.open();*/
    this.alert.cancelButton = true;
    this.alert.okButton = true;
    this.alert.alertTitle = "A simple Confirm modal window";
    this.alert.message = "Confirm is a classic (title/body/footer) 2 button modal window";
    //this.alert.message = require('./alert.modal.html');
    this.alert.okButtonText = "Ok, Got it.";
    this.alert.cancelButtonText = "Close";
    this.alert.open();
  }

  confirmClose(event) {
      console.log(event);
  }

}
