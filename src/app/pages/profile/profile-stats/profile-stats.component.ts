import {Component, OnInit} from '@angular/core';
import {Chart} from 'angular-highcharts';
import {StatsService} from '../../../services/stats.service';
import {AuthService} from '../../../services/auth.service';
import {TwitterService} from '../../../services/twitter.service';
import {FacebookService} from '../../../services/facebook.service';

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
   * All filters. The same filter cab be used in more visualization type.
   */
  filters = {
    filterDate: {
      name: 'Filter by Date',
      dateFrom: new Date(),
      dateTo: new Date(),
    },
    filterCategory: {
      name: 'Group by Category',
      groupBy: false,
    },
    filterCoordinate: {
      name: 'Filter by Coordinate',
      latitude: null,
      longitude: null,
      radius: null,
    },
    filterMessage: {
      name: 'Source',
      source: 'all',
      sources: ['all', 'facebook', 'twitter'],
      limit: null,
    },

    // TODO add here new filters
  };

  /**
   * All available visualization.
   * Add here new visualizations to display them on the view.
   */
  visualizations = [{
    name: 'Personal Data Summary',
    id: 'personaldata-source',
    types: [
      {
        name: 'pie',
        id: 'pie',
        filters: [],
      },
    ]
  }, {
    name: 'Network Statistics',
    id: 'personaldata-netstat',
    types: [
      {
        name: 'timeline',
        id: 'spline',
        filters: [this.filters.filterDate],
      },
      {
        name: 'barchart',
        id: 'bar',
        filters: [this.filters.filterDate],
      },
    ]
  }, {
    name: 'App Usage',
    id: 'personaldata-appinfo',
    types: [
      {
        name: 'timeline',
        id: 'spline',
        filters: [this.filters.filterDate],
      },
      {
        name: 'barchart',
        id: 'bar',
        filters: [this.filters.filterDate, this.filters.filterCategory],
      },
    ]
  }, {
    name: 'GPS Positions',
    id: 'personaldata-gps',
    types: [
      {
        name: 'map',
        id: 'map',
        filters: [this.filters.filterDate, this.filters.filterCoordinate],
      },
    ]
  }, {
    name: 'Display Statistics',
    id: 'personaldata-display',
    types: [
      {
        name: 'barchart',
        id: 'bar',
        filters: [this.filters.filterDate],
      },
    ]
  }, {
    name: 'Social Messages',
    id: 'messages-list',
    types: [
      {
        name: 'list',
        id: 'list',
        filters: [this.filters.filterMessage],
      },
    ]
  },

    // TODO add here new visualization
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

  /**
   * GPS coordinate.
   */
  gpsCoordinate: {latitude: number, longitude: number}[];

  /**
   * Social Network messages (tweets, Facebook posts, etc).
   */
  socialMessages: any;

  constructor(
    private statsService: StatsService,
    private authService: AuthService,
    private facebookService: FacebookService,
    private twitterService: TwitterService,
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

    this.buildPersonalDataNetstatChart().then((chart) => {
      if (chart) {
        this.defaultCharts.push({name: 'Network Statistics', chart: chart});
      }
    });

    this.buildPersonalDataAppinfoChart().then((chart) => {
      if (chart) {
        this.defaultCharts.push({name: 'Application Usage', chart: chart});
      }
    });

    this.buildPersonalDataDisplayChart().then((chart) => {
      if (chart) {
        this.defaultCharts.push({name: 'Display Statistics', chart: chart});
      }
    });

    // TODO add here new default visualization building methods
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
        this.buildPersonalDataSourceChart(this.selected.type.id).then((chart) => {
          this.customChart = chart;
        });
        break;
      case 'personaldata-gps':
        this.buildGPSPositionChart();
        break;
      case 'personaldata-netstat':
        this.buildPersonalDataNetstatChart(this.selected.type.id).then((chart) => {
          this.customChart = chart;
        });
        break;
      case 'personaldata-appinfo':
        this.buildPersonalDataAppinfoChart(this.selected.type.id).then((chart) => {
          this.customChart = chart;
        });
        break;
      case 'messages-list':
        this.buildSocialMessagesList();
        break;
      case 'personaldata-display':
        this.buildPersonalDataDisplayChart(this.selected.type.id).then((chart) => {
          this.customChart = chart;
        });
        break;
      default:
        break;
    }
  }

  /**
   * Build a pie chart with the personal data source type frequency.
   * @param type: the chart type.
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

  /**
   * Build a map with the user GPS positions.
   */
  private buildGPSPositionChart() {
    const filters = {
      latitude: this.filters.filterCoordinate.latitude,
      longitude: this.filters.filterCoordinate.longitude,
      radius: this.filters.filterCoordinate.radius,
      dateFrom: this.filters.filterDate.dateFrom,
      dateTo: this.filters.filterDate.dateTo,
    };
    this.gpsCoordinate = null;
    return this.statsService.getGPSMapStats(filters).then(
      (stats) => {
        if (stats && stats.length) {
          this.gpsCoordinate = stats;
        }
      }
    );
  }

  /**
   * Build the network statistics chart.
   * @param type: the chart type.
   */
  private buildPersonalDataNetstatChart(type?: string): Promise<Chart | any> {
    let filters;
    if (type) {
      filters = {
        dateFrom: this.filters.filterDate.dateFrom,
        dateTo: this.filters.filterDate.dateTo,
      };
    }

    switch (type) {
      case 'bar':
        return this.statsService.getNetStatsBarStats(filters).then(
          (stats) => {

            this.chartsLoading = false;
            if (stats && stats.length > 0) {

              // group netstats
              const newStats = [];
              for (let i = 0; i < stats.length; i++) {
                newStats.push({
                  name: stats[i].networkType + '-received',
                  value: stats[i].totalRxBytes
                });
                newStats.push({
                  name: stats[i].networkType + '-transmitted',
                  value: stats[i].totalTxBytes
                });
              }

              // set array for chart display
              const toDisplay = [[], []];
              for (let i = 0; i < newStats.length; i++) {
                toDisplay[0].push(newStats[i].name);
                toDisplay[1].push(newStats[i].value);
              }

              const chart = new Chart({
                chart: {
                  type: type
                },
                title: null,
                xAxis: {
                  categories: toDisplay[0],
                  title: {
                    text: 'Network Type',
                  }
                },
                yAxis: {
                  title: {
                    text: 'Data received/transmitted (in bytes)'
                  },
                  labels: {
                    overflow: 'justify'
                  }
                },
                credits: {
                  enabled: false
                },
                plotOptions: {
                  bar: {
                    colorByPoint: true
                  }
                },
                series: [{
                  name: 'Data received/transmitted (in bytes)',
                  data: toDisplay[1]
                }]
              });
              return Promise.resolve(chart);
            }
          },
          (err) => {
            this.chartsLoading = false;
          });

      case 'spline':
      default:
        return this.statsService.getNetStatsTimelineStats(filters).then(
          (stats) => {

            this.chartsLoading = false;
            if (stats && stats.length > 0) {

              // group netstats
              let newStats = [];
              for (let i = 0; i < stats.length; i++) {

                newStats.push({
                  networkType: stats[i].networkType + '-received',
                  values: stats[i].values.map((val) => {
                    return {
                      date: val.date,
                      value: val.totalRxBytes
                    };
                  })
                });

                newStats.push({
                  networkType: stats[i].networkType + '-transmitted',
                  values: stats[i].values.map((val) => {
                    return {
                      date: val.date,
                      value: val.totalTxBytes
                    };
                  })
                });
              }

              // set timeline colors
              newStats = newStats.map((stat) => {
                let color = '#000000';
                if (stat.networkType.startsWith('wifi')) {
                  color = '#73E639';
                } else if (stat.networkType.startsWith('mobile')) {
                  color = '#E63939';
                }
                return {
                  name: stat.networkType,
                  data: stat.values.sort((a, b) => a.date - b.date).map(elem => {
                    return [(new Date(elem.date * 86400000)).getTime(), elem.value];
                  }),
                  color: color
                };
              });

              const chart = new Chart({
                chart: {
                  type: type || 'spline',
                },
                title: null,
                xAxis: {
                  type: 'datetime',
                  dateTimeLabelFormats: {
                    month: '%e. %b',
                    year: '%b'
                  },
                  title: {
                    text: 'Date'
                  }
                },
                yAxis: {
                  title: {
                    text: 'Network Statistics (Rx and Tx bytes)'
                  }
                },
                credits: {
                  enabled: false
                },
                exporting: {
                  buttons: {
                    contextButton: {
                      enabled: false
                    }
                  }
                },
                legend: {
                  enabled: false
                },
                series: newStats
              });
              return Promise.resolve(chart);
            }
          },
          (err) => {
            this.chartsLoading = false;
          });
    }

  }

  /**
   * Build the application usage statistics chart.
   * @param type: the chart type.
   */
  private buildPersonalDataAppinfoChart(type?: string): Promise<Chart | any> {
    let filters;
    if (type) {
      filters = {
        dateFrom: this.filters.filterDate.dateFrom,
        dateTo: this.filters.filterDate.dateTo,
        groupByCategory: this.filters.filterCategory.groupBy,
      };
    }

    switch (type) {
       case 'spline':
        return this.statsService.getAppInfoTimelineStats(filters).then(
          (stats) => {

            this.chartsLoading = false;
            if (stats && stats.length > 0) {

              stats = stats.map((stat) => {
                return {
                  name: stat.name,
                  data: stat.values.sort((a, b) => a.date - b.date).map((elem) => {
                    return [(new Date(elem.date * 86400000)).getTime(), elem.value];
                  }),
                  color: '#000000'
                };
              });

              const chart = new Chart({
                chart: {
                  type: type || 'spline',
                },
                title: null,
                xAxis: {
                  type: 'datetime',
                  dateTimeLabelFormats: {
                    month: '%e. %b',
                    year: '%b'
                  },
                  title: {
                    text: 'Date'
                  }
                },
                yAxis: {
                  title: {
                    text: 'App Usage Distribution'
                  }
                },
                credits: {
                  enabled: false
                },
                exporting: {
                  buttons: {
                    contextButton: {
                      enabled: false
                    }
                  }
                },
                legend: {
                  enabled: false
                },
                series: stats
              });
              return Promise.resolve(chart);
            }
          },
          (err) => {
            this.chartsLoading = false;
          });
      case 'bar':
      default:
        return this.statsService.getAppInfoBarStats(filters).then(
          (stats) => {

            this.chartsLoading = false;
            if (!(stats && stats.length > 0)) {
            } else {

              // set array for chart display
              const toDisplay = [[], []];
              for (let i = 0; i < stats.length; i++) {
                toDisplay[0].push(stats[i].name);
                toDisplay[1].push(stats[i].value);
              }

              const chart = new Chart({
                chart: {
                  type: type || 'bar'
                },
                tooltip: {
                  pointFormat: '{series.name}: <b>{point.y}</b>'
                },
                title: null,
                xAxis: {
                  categories: toDisplay[0],
                  title: {
                    text: this.filters.filterCategory.groupBy ? 'Categories' : 'Package Name'
                  }
                },
                yAxis: {
                  title: {
                    text: 'Total Foreground Time (in milliseconds)'
                  },
                  labels: {
                    overflow: 'justify'
                  }
                },
                credits: {
                  enabled: false
                },
                plotOptions: {
                  bar: {
                    colorByPoint: true,
                  }
                },
                series: [{
                  name: 'Total Foreground Time (in milliseconds)',
                  data: toDisplay[1]
                }]
              });
              return Promise.resolve(chart);
            }
          },
          (err) => {
            this.chartsLoading = false;
          });
    }

  }

  /**
   * Build the user social messages list.
   */
  private buildSocialMessagesList() {
    this.socialMessages = [];
    const messagesNumber = this.filters.filterMessage.limit || 1000;

    switch (this.filters.filterMessage.source) {
      case 'twitter':
        this.twitterService.timeline(messagesNumber).subscribe((res) => {
          if (res.messages && res.messages.length) {
            this.socialMessages = res.messages;
          }
        });
        break;
      case 'facebook':
        this.facebookService.userPosts(messagesNumber).subscribe((res) => {
          if (res.messages && res.messages.length) {
            this.socialMessages = res.messages;
          }
        });
        break;
      default:
        this.facebookService.userPosts(messagesNumber / 2).subscribe((res) => {
          if (res.messages && res.messages.length) {
            res.messages.forEach((message) => {
              this.socialMessages.push(message);
            });
          }
        });
        this.twitterService.timeline(messagesNumber / 2).subscribe((res) => {
          if (res.messages && res.messages.length) {
            res.messages.forEach((message) => {
              this.socialMessages.push(message);
            });
          }
        });
        break;
    }
  }

  /**
   * Build the display usage statistics chart.
   * @param type: the chart type.
   */
  private buildPersonalDataDisplayChart(type?: string): Promise<Chart | any> {
    let filters;

    if (type) {
      filters = {
        dateFrom: this.filters.filterDate.dateFrom,
        dateTo: this.filters.filterDate.dateTo,
      };
    }

    switch (type) {
      case 'bar':
      default:
        return this.statsService.getDisplayBarStats(filters).then(
          (stats) => {

            this.chartsLoading = false;
            if (stats && stats.length > 0) {

              // set array for chart display
              const toDisplay = [[], []];
              for (let i = 0; i < stats.length; i++) {
                toDisplay[0].push(stats[i].name);
                toDisplay[1].push(stats[i].value);
              }

              const chart = new Chart({
                chart: {
                  type: type || 'bar'
                },
                title: null,
                xAxis: {
                  categories: toDisplay[0],
                  title: {
                    text: 'Times',
                  }
                },
                yAxis: {
                  title: {
                    text: 'Display Statistics (in milliseconds)'
                  },
                  labels: {
                    overflow: 'justify'
                  }
                },
                credits: {
                  enabled: false
                },
                plotOptions: {
                  bar: {
                    colorByPoint: true
                  }
                },
                series: [{
                  name: 'Display Statistics (in milliseconds)',
                  data: toDisplay[1]
                }]
              });
              return Promise.resolve(chart);
            }
          },
          (err) => {
            this.chartsLoading = false;
          });
      }

    }

}
