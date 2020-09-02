import {ReportStatus} from '../models/report.model';
import * as CanvasJS from './canvasjs.min';

export default class Utility {

  getMyId() {
    return localStorage.getItem('virtuallabs_studentId');
  }

  isProfessor() {
    return JSON.parse(localStorage.getItem('virtuallabs_isProfessor'));
  }

  localDateTimeToString(localDateTime: string): string {
    // ex. FROM '2022-12-21T14:10:46' TO '2022,12,21,14,10,46'
    const dateTime = localDateTime.toString().split('T');
    const date = dateTime[0].split('-');
    const time = dateTime[1].split(':');
    return '' + date[0] + ',' + date[1] + ',' + date[2] + ',' + time[0] + ',' + time[1] + ',' + time[2];
  }

  formatDate(date: string) {
    const splitted = date.toString().split(',').map(s => Number(s));
    return new Date(splitted[0], splitted[1] - 1, splitted[2], splitted[3], splitted[4], splitted[5]);
  }

  toLocalDateTime(date: string): string {
    // ex. FROM '2020,7,1,18,20,2' TO '2022-07-01T18:20:02'
    const dateSplit = date.toString().split(',');
    const day = (`0${dateSplit[2]}`).slice(-2); // add '0' in front of the number, if necessary
    const month = (`0${dateSplit[1]}`).slice(-2); // add '0' in front of the number, if necessary
    const hours = (`0${dateSplit[3]}`).slice(-2); // add '0' in front of the number, if necessary
    const minutes = (`0${dateSplit[4]}`).slice(-2); // add '0' in front of the number, if necessary
    const seconds = (`0${dateSplit[5]}`).slice(-2); // add '0' in front of the  number, if necessary
    return '' + dateSplit[0] + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds;
  }

  getColorForStatus(status: string) {
    switch (status) {
      case ReportStatus.NULL: {
        return '#818181';
      }
      case ReportStatus.READ: {
        return '#ff8400';
      }
      case ReportStatus.SUBMITTED: {
        return '#ffe602';
      }
      case ReportStatus.REVISED: {
        return '#02b2ff';
      }
      case ReportStatus.GRADED: {
        return '#07ff15';
      }
      default: {
        return '#000000';
      }
    }
  }

  calcDiskLabel(value: number) {
    if (value < 1024)
      return value + ' GB';
    else if (value % 1024)
      return (value / 1024).toFixed(1) + ' TB';
    else
      return (value / 1024) + ' TB';
  }

  formatText(str: string): string {
    return str.replace(/\n/g, '<br/>').replace(/\u0009/g, '&emsp;');
  }

  renderChartPasses() {
    const enrolledPassesNum = Math.random() * (36 - 2) + 2;
    const enrolledFailedNum = 40 - enrolledPassesNum;
    const firstTimeEnrolledPassesNum = Math.random() * (38 - 2) + 2;
    const firstTimeEnrolledFailedNum = 40 - firstTimeEnrolledPassesNum;
    const chart = new CanvasJS.Chart('chartContainerPasses', {
      zoomEnabled: true,
      animationEnabled: true,
      exportEnabled: true,
      title: {
        fontFamily: 'Arial',
        text: 'Passes detail'
      },
      toolTip: {
        shared: true
      },
      legend: {
        fontSize: 16,
        fontFamily: 'Arial',
        fontColor: '#1e2f41',
        cursor: 'pointer',
        itemclick: this.toggleDataSeries,
      },
      height: 375,
      axisX: {
        margin: 10
      },
      axisY: {
        lineColor: 'rgb(74,219,97)',
        tickColor: 'rgb(74,219,97)',
        labelFontColor: 'rgb(74,219,97)',
        margin: 10,
      },
      axisY2: {
        lineColor: 'rgb(219,74,74)',
        tickColor: 'rgb(219,74,74)',
        labelFontColor: 'rgb(219,74,74)',
      },
      data: [{
        type: 'column',
        name: 'Passed exam',
        color: 'rgb(74,219,97)',
        showInLegend: true,
        yValueFormatString: '##0 students',
        dataPoints: [
          { label: 'Enrolled',  y: enrolledPassesNum },
          { label: 'First time enrolled', y: firstTimeEnrolledPassesNum },
        ]
      },
        {
          type: 'column',
          name: 'Failed exam',
          color: 'rgb(219,74,74)',
          axisYType: 'secondary',
          showInLegend: true,
          yValueFormatString: '##0 students',
          dataPoints: [
            { label: 'Enrolled', y: enrolledFailedNum },
            { label: 'First time enrolled', y: firstTimeEnrolledFailedNum },
          ]
        }],
    });
    chart.render();
  }

  renderChartGrades() {
    const dataPoints = [];
    let y = 0;
    for ( let i = 18; i < 31; i++ ) {
      // y += Math.round(2 + Math.random() * (-2 - 2));
      y = Math.floor(Math.random() * (40 + 1));
      dataPoints.push({y, label: i});
    }
    const chart = new CanvasJS.Chart('chartContainerGrades', {
      zoomEnabled: true,
      animationEnabled: true,
      exportEnabled: true,
      title: {
        fontFamily: 'Arial',
        text: 'Grades detail'
      },
      legend: {
        fontSize: 16,
        fontFamily: 'Arial',
        fontColor: '#1e2f41',
      },
      height: 375,
      axisX: {
        title: 'Grade',
        margin: 10
      },
      axisY: {
        title: '# Students',
        margin: 10
      },
      data: [
        {
          type: 'line',
          showInLegend: false,
          name: 'number of enrolled students',
          dataPoints
        }]
    });
    chart.render();
  }

  toggleDataSeries(e) {
    e.dataSeries.visible = !(typeof (e.dataSeries.visible) === 'undefined' || e.dataSeries.visible);
    e.chart.render();
  }

  public getRandom(from: number, to: number): number {
    return Math.floor(Math.random() * (to + 1)) + from;
  }
}
