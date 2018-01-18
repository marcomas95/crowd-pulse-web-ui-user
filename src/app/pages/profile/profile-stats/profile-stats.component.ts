import {Component, OnInit} from '@angular/core';
import {Chart} from 'angular-highcharts';
import {StatsService} from '../../../services/stats.service';
import {AuthService} from '../../../services/auth.service';

@Component({
  styleUrls: ['./profile-stats.component.scss'],
  templateUrl: './profile-stats.component.html',
})
export class ProfileStatsComponent implements OnInit {

  /**
   * User data.
   */
  user: any;

  /**
   * All filters.
   */
  filters = {
    filterDate: 'Filter by Date',
    filterCategory: 'Group by Category',
    filterCoordinate: 'Filter by Coordinate'
  };

  /**
   * All available visualization.
   * Add here new visualizations to display them on the view.
   */
  visualizations = [
    {
      name: 'Personal Data Summary',
      id: 'personaldata-source',
      types: [
        {
          name: 'pie',
          filters: [],
        },
      ]
    },
    {
      name: 'Net Stat',
      id: 'personaldata-netstat',
      types: [
        {
          name: 'timeline',
          filters: [this.filters.filterDate, this.filters.filterCategory],
        },
        {
          name: 'barchart',
          filters: [this.filters.filterDate, this.filters.filterCategory],
        },
      ]
    },
    {
      name: 'App Info',
      id: 'personaldata-appinfo',
      types: [
        {
          name: 'timeline',
          filters: [this.filters.filterDate, this.filters.filterCategory],
        },
        {
          name: 'barchart',
          filters: [this.filters.filterDate, this.filters.filterCategory, this.filters.filterCoordinate],
        },
      ]
    },
    {
      name: 'GPS Position',
      id: 'personaldata-gps',
      types: [
        {
          name: 'map',
          filters: [this.filters.filterCoordinate],
        },
      ]
    }
  ];

  /**
   * Current selected visualization and visualization type.
   * Variable used in the template to display/hidden specific elements.
   */
  selected = {
    visualization: null,
    type: null,
  };

  /**
   * Default visualizations (with summary data).
   */
  defaultCharts: {name: string, chart: Chart}[] = [];

  /**
   * Custom chart.
   */
  customChart: Chart;

  /**
   * For UI progress spinner, true if charts are loading.
   */
  chartsLoading: boolean;

  constructor(
    private statsService: StatsService,
    private authService: AuthService,
  ) {
    this.user = authService.getCachedUser();
    this.chartsLoading = true;
  }

  /**
   * @override
   */
  ngOnInit() {

    // build default visualization charts
    this.buildPersonalDataSourceChart().then((chart) => {
      if (chart) {
        this.defaultCharts.push({name: 'Android Data Summary', chart: chart});
      }
    });
  }

  /**
   * Remove selected type and filters.
   */
  clearFilter() {
    if (this.selected.visualization) {

      // set the first type as default
      this.selected.type = this.selected.visualization.types[0];
      this.updateChart();
    }
  }

  /**
   * Update the custom chart with new filters.
   */
  updateChart() {
    this.customChart = undefined;
    this.buildCustomChart();
  }

  private buildCustomChart() {
    switch (this.selected.visualization.id) {
      case 'personaldata-source':
        this.buildPersonalDataSourceChart(this.selected.type.name).then((chart) => {
          this.customChart = chart;
        });
        break;
      case '':
        break;
      default:
        break;
    }
  }

  /**
   * Build a pie chart with the personal data source type frequency.
   */
  private buildPersonalDataSourceChart(type?: string): Promise<Chart | any> {
    return this.statsService.getPersonalDataSourceStats().then(
      (stats) => {

        this.chartsLoading = false;
        if (stats && stats.length > 0) {
          const chart = new Chart({
            chart: {
              type: type || 'pie'
            },
            title: null,
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

  private buildGPSPositionChart() {
  }

  private buildTestChart() {
  }

}
