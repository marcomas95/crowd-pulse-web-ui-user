import {Component, Input, OnInit} from '@angular/core';
import {StatsService} from '../../../../services/stats.service';
import {environment} from '../../../../../environments/environment';
import {InfoDialogComponent} from '../../../../components/info-dialog/info-dialog.component';
import {MatDialog} from '@angular/material';
import {Chart} from 'angular-highcharts';


@Component({
  selector: 'app-profile-physical-state',
  styleUrls: ['./../profile-data.component.scss'],
  templateUrl: './profile-data-physical-state.component.html'
})
export class ProfileDataPhysicalStateComponent {

  /**
   * The user profile (logged or not).
   */
  @Input() user: any;

  /**
   * Custom chart.
   */
  customChart: Chart;

  /**
   * Sleep array.
   */
  sleeps = [];

  /**
   * For UI progress spinner, true if charts are loading.
   */
  chartsLoading: boolean;

  /**
   * Available behavior source.
   */
  types = [ {
    id: 'sleep',
    name: 'Sleep',
  }, {
    id: 'heart',
    name: 'Heart-Rate',
  }, {
    id: 'body',
    name: 'Body',
  }, {
    id: null,
    name: 'None',
  },
  ];


  /**
   * Available behavior source.
   */
  visualization = [ {
    id: 'pie',
    name: 'Pie Chart',
  }, {
    id: 'bar',
    name: 'Bar Chart',
  }, {
    id: 'line',
    name: 'Line Chart',
  },
  ];




  /**
   * Selected type.
   */
  selectedType: {id: string, name: string};

  /**
   * Selected chart.
   */
  selectedChart: {id: string, name: string};

  /**
   * Filter available.
   */
  filter = {
    dateFrom: new Date(),
    dateTo: new Date(),
    type: this.types[1].id
  };

  /**
   * Application name.
   */
  appName = environment.appName;

  /**
   * Contains all the posts coordinates
   */
  postsCoordinates: any;


  constructor(
    private statsService: StatsService,
    private dialog: MatDialog,
  ) {}


  /**
   * @override
   */
  ngOnInit(): void {
    this.filter.dateFrom.setDate(1);
  }



  /**
   * Build chart with filter value.
   */
  updateChart() {

    this.customChart = undefined;
    this.chartsLoading = true;
    switch (this.selectedType.id) {

      case 'sleep':
        if (this.selectedChart.id == 'line') {
          this.buildSleepDataSourceChartLine(this.selectedChart.id).then((chart) => {
            this.customChart = chart;
          });
        } else {
          this.buildSleepDataSourceChart(this.selectedChart.id).then((chart) => {
          this.customChart = chart;
          });
        }
        break;

      case 'heart':
        if (this.selectedChart.id == 'line') {
          this.buildHeartDataSourceChartLine(this.selectedChart.id).then((chart) => {
            this.customChart = chart;
          });
        } else {
          this.buildHeartDataSourceChart(this.selectedChart.id).then((chart) => {
            this.customChart = chart;
          });
        }

        break;
      case 'body':
        if (this.selectedChart.id == 'line') {
          this.buildBodyDataSourceChartLine(this.selectedChart.id).then((chart) => {
            this.customChart = chart;
          });
        } else {
          this.buildBodyDataSourceChart(this.selectedChart.id).then((chart) => {
            this.customChart = chart;
          });
        }
        break;
      default:
        this.customChart = null;
        break;
    }

  }


  /**
   * Build a pie or bar chart with the sleep data source type frequency.
   * @param type: the chart type.
   */
  private buildSleepDataSourceChart(type?: string): Promise<Chart | any> {
    return this.statsService.getSleepTypeDataFitbitLine(this.filter).then(
      (stats) => {

        let duration = 0, efficiency = 0, minutesAfterWakeup = 0, minutesAsleep = 0,
          minutesAwake = 0, minutesToFallAsleep = 0, timeInBed = 0;
        let i;
        for (i = 0; i < stats.length; i++) {

            if (stats[i].duration) {
              duration = duration + stats[i].duration;
            }
            if (stats[i].efficiency) {
              efficiency = efficiency + stats[i].efficiency;
            }
            if (stats[i].minutesAfterWakeup) {
              minutesAfterWakeup = minutesAfterWakeup + stats[i].minutesAfterWakeup;
            }
            if (stats[i].minutesAsleep) {
              minutesAsleep = minutesAsleep + stats[i].minutesAsleep;
            }
            if (stats[i].minutesAwake) {
              minutesAwake = minutesAwake + stats[i].minutesAwake;
            }
            if (stats[i].minutesToFallAsleep) {
              minutesToFallAsleep = minutesToFallAsleep + stats[i].minutesToFallAsleep;
            }
            if (stats[i].timeInBed) {
              timeInBed = timeInBed + stats[i].timeInBed;
            }
        }
        duration = duration / (60 * 1000);

        const sleeps = [{name: 'Duration', value: duration}, {name: 'Efficiency', value: efficiency},
          {name: 'Minutes After Wakeup', value: minutesAfterWakeup}, {name: 'Minutes A Sleep', value: minutesAsleep},
          {name: 'Minutes A Wake', value: minutesAwake}, {name: 'Minutes To Fall A sleep', value: minutesToFallAsleep},
          {name: 'Time In Bed', value: timeInBed}];


        this.chartsLoading = false;
        if (stats && stats.length > 0) {
          const chart = new Chart({
            chart: {
              type: type || 'pie'
            },
            title: {
              text: 'SLEEP'
            },
            subtitle: {
              text: 'This graph shows the distribution of minutes of sleep'
            },
            credits: {
              enabled: false
            },
            series: [{
              data: sleeps.map((sleep) => ({name: sleep.name, y: sleep.value}))
            }]
          });

          return Promise.resolve(chart);
        }
      },
      (err) => {
        this.chartsLoading = false;
      });
  }



  /**
   * Build a line chart with the sleep data source type frequency.
   * @param type: the chart type.
   */
  private buildSleepDataSourceChartLine(type?: string): Promise<Chart | any> {
    return this.statsService.getSleepTypeDataFitbitLine(this.filter).then(
      (stats) => {

        const duration = [];
        let i, d = 0, a = 0;
        for (i = 0; i < stats.length; i++) {

          if (stats[i].duration) {
            d = ((stats[i].duration / (1000 * 60 * 60)) % 24);
            a = Number(d.toFixed());
            duration.push({value: d});
          }
        }

        this.chartsLoading = false;
        if (stats && stats.length > 0) {
          const chart = new Chart({
            chart: {
              type: 'line'
            },
            title: {
              text: 'SLEEP'
            },
            subtitle: {
              text: 'This graph shows the trend over time of hours sleep'
            },
            xAxis: {
              categories: []
            },
            yAxis: {
              categories: []
            },
            credits: {
              enabled: false
            },
            series: [{
              data: duration.map((stat) => ({name: 'Sleep duration', y: stat.value}))
            }]
          });

          return Promise.resolve(chart);
        }
      },
      (err) => {
        this.chartsLoading = false;
      });
  }




  /**
   * Build a pie or bar chart with the heart data source type frequency.
   * @param type: the chart type.
   */
  private buildHeartDataSourceChart(type?: string): Promise<Chart | any> {
    return this.statsService.getHeartTypeDataFitbitLine(this.filter).then(
      (stats) => {

        let restingHeartRate = 0, outOfRange_minutes = 0, fatBurn_minutes = 0, cardio_minutes = 0,
          peak_minutes = 0;
        let i;
        for (i = 0; i < stats.length; i++) {

          if (stats[i].restingHeartRate) {
            restingHeartRate = restingHeartRate + stats[i].restingHeartRate;
          }
          if (stats[i].outOfRange_minutes) {
            outOfRange_minutes = outOfRange_minutes + stats[i].outOfRange_minutes;
          }
          if (stats[i].fatBurn_minutes) {
            fatBurn_minutes = fatBurn_minutes + stats[i].fatBurn_minutes;
          }
          if (stats[i].cardio_minutes) {
            cardio_minutes = cardio_minutes + stats[i].cardio_minutes;
          }
          if (stats[i].peak_minutes) {
            peak_minutes = peak_minutes + stats[i].peak_minutes;
          }
        }

        const hearts = [{name: 'restingHeartRate', value: restingHeartRate}, {name: 'outOfRange_minutes', value: outOfRange_minutes},
          {name: 'fatBurn_minutes', value: fatBurn_minutes}, {name: 'cardio_minutes', value: cardio_minutes},
          {name: 'peak_minutes', value: peak_minutes}];

        this.chartsLoading = false;
        if (stats && stats.length > 0) {
          const chart = new Chart({
            chart: {
              type: type || 'pie'
            },
            title: {
              text: 'HEARTBEAT'
            },
            subtitle: {
              text: 'This graph shows the distribution of minutes of heartbeat'
            },
            credits: {
              enabled: false
            },
            series: [{
              data: hearts.map((stat) => ({name: stat.name, y: stat.value}))
            }]
          });

          return Promise.resolve(chart);
        }
      },
      (err) => {
        this.chartsLoading = false;
      });
  }



  /**
   * Build a line chart with the heart data source type frequency.
   * @param type: the chart type.
   */
  private buildHeartDataSourceChartLine(type?: string): Promise<Chart | any> {
    return this.statsService.getHeartTypeDataFitbitLine(this.filter).then(
      (stats) => {

        this.chartsLoading = false;
        if (stats && stats.length > 0) {
          const chart = new Chart({
            chart: {
              type: 'line'
            },
            title: {
              text: 'HEARTBEAT'
            },
            subtitle: {
              text: 'This graph shows the trend over time of heartbeat'
            },
            credits: {
              enabled: false
            },
            series: [{
              data: stats.map((stat) => ({name: 'Heart Rate', y: stat.restingHeartRate}))
            }]
          });

          return Promise.resolve(chart);
        }
      },
      (err) => {
        this.chartsLoading = false;
      });
  }





  /**
   * Build a pie or bar chart with the body data source type frequency.
   * @param type: the chart type.
   */
  private buildBodyDataSourceChart(type?: string): Promise<Chart | any> {
    return this.statsService.getBodyTypeDataFitbit(this.filter).then(
      (stats) => {

        let i;
        for (i = 0; i < stats.length; i++) {

          if (stats[i].name == null) {
            stats.splice(i, 1);
          }
        }

        this.chartsLoading = false;
        if (stats && stats.length > 0) {
          const chart = new Chart({
            chart: {
              type: type || 'pie'
            },
            title: {
              text: 'BODY'
            },
            subtitle: {
              text: 'This graph shows the distribution of body values'
            },
            credits: {
              enabled: false
            },
            series: [{
              data: stats.map((stat) => ({name: stat.name, y: stat.value}))
            }]
          });

          return Promise.resolve(chart);
        }
      },
      (err) => {
        this.chartsLoading = false;
      });
  }



  /**
   * Build a line chart with the body data source type frequency.
   * @param type: the chart type.
   */
  private buildBodyDataSourceChartLine(type?: string): Promise<Chart | any> {
    return this.statsService.getBodyTypeDataFitbitLine(this.filter).then(
      (stats) => {

        this.chartsLoading = false;
        if (stats && stats.length > 0) {
          const chart = new Chart({
            chart: {
              type: 'line'
            },
            title: {
              text: 'WEIGHT'
            },
            subtitle: {
              text: 'This graph shows the trend of weight over time'
            },
            credits: {
              enabled: false
            },
            series: [{
              data: stats.map((stat) => ({name: 'Weight', y: stat.bodyWeight}))
            }]
          });

          return Promise.resolve(chart);
        }
      },
      (err) => {
        this.chartsLoading = false;
      });
  }




  clickedMarker(marker: any) {
    // console.log(marker);
    let message;
    const toConvert = new Date(marker.date);
    message = 'Text: ' + marker.text + '\nDate: ' + toConvert.toLocaleDateString() ;
    this.openInfoDialog(message);
  }


  /**
   * Open a dialog with information about data source.
   * @param info: the info message
   */
  openInfoDialog(info: string) {
    this.dialog.open(InfoDialogComponent, {
      data: {infoText: info},
    });
  }

}
