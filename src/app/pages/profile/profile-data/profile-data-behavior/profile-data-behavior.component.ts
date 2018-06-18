import {Component, Input, OnInit} from '@angular/core';
import {StatsService} from '../../../../services/stats.service';
import {environment} from '../../../../../environments/environment';
import {InfoDialogComponent} from '../../../../components/info-dialog/info-dialog.component';
import {MatDialog} from '@angular/material';
import {Chart} from 'angular-highcharts';

@Component({
  selector: 'app-profile-behavior',
  styleUrls: ['./../profile-data.component.scss'],
  templateUrl: './profile-data-behavior.component.html'
})
export class ProfileDataBehaviorComponent implements OnInit {

  /**
   * The user profile (logged or not).
   */
  @Input() user: any;

  /**
   * Custom chart.
   */
  customChart: Chart;

  /**
   * For UI progress spinner, true if charts are loading.
   */
  chartsLoading: boolean;

  /**
   * Available behavior source.
   */
  types = [ {
    id: 'location',
    name: 'Places',
  }, {
    id: 'activity',
    name: 'Activities',
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

    this.statsService.getMapStats(this.filter).then((stats) => {
      this.postsCoordinates = stats.map((data) => {
        return {
          text: data.text,
          latitude: data.latitude,
          longitude: data.longitude,
          date: data.date,
          fromUser: data.fromUser
        };
      });

      for (let i = this.postsCoordinates.length - 1; i >= 0; i--) {
        if (this.postsCoordinates[i].latitude == null) {
          this.postsCoordinates.splice(i, 1);
        }
      }
    });
  }






  /**
   * Build chart with filter value.
   */
  updateChart() {

    this.customChart = undefined;
    this.chartsLoading = true;
    switch (this.selectedType.id) {

      case 'location':

        this.statsService.getMapStats(this.filter).then((stats) => {
          this.postsCoordinates = stats.map((data) => {
            return {
              text: data.text,
              latitude: data.latitude,
              longitude: data.longitude,
              date: data.date,
              fromUser: data.fromUser
            };
          });

          for (let i = this.postsCoordinates.length - 1; i >= 0; i--) {
            if (this.postsCoordinates[i].latitude == null) {
              this.postsCoordinates.splice(i, 1);
            }
          }
        });
        break;
      case 'activity':
        if (this.selectedChart.id == 'line') {
          this.buildActivityDataSourceChartLine(this.selectedChart.id).then((chart) => {
            this.customChart = chart;
          });

        } else {
            this.buildActivityDataSourceChart(this.selectedChart.id).then((chart) => {
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
   * Build a pie or bar chart with the activity data source type frequency.
   * @param type: the chart type.
   */
  private buildActivityDataSourceChart(type?: string): Promise<Chart | any> {
    return this.statsService.getActivityTypeDataFitbit(this.filter).then(
      (stats) => {

        stats.forEach(function(element) {
          if (element.name == null) {
            element.name = 'sedentary';
          }
        });

       this.chartsLoading = false;
        if (stats && stats.length > 0) {
          const chart = new Chart({
            chart: {
              type: type || 'pie'
            },
            title: {
              text: 'ACTIVITIES'
            },
            subtitle: {
              text: 'This graph shows the distribution of activities'
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
   * Build a line chart with the activity data source type frequency.
   * @param type: the chart type.
   */
  private buildActivityDataSourceChartLine(type?: string): Promise<Chart | any> {
    return this.statsService.getActivityTypeDataFitbitLine(this.filter).then(
      (stats) => {

        this.chartsLoading = false;
        if (stats && stats.length > 0) {
          const chart = new Chart({
            chart: {
              type: 'line'
            },
            title: {
              text: 'ACTIVITIES'
            },
            subtitle: {
              text: 'This graph shows the distribution of steps'
            },
            credits: {
              enabled: false
            },
            series: [{
              data: stats.map((stat) => ({name: 'Steps', y: stat.steps}))
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





