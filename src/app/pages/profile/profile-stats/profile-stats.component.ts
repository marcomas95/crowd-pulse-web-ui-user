import {Component} from '@angular/core';
import {Chart} from 'angular-highcharts';
import {StatsService} from '../../../services/stats.service';
import {AuthService} from '../../../services/auth.service';
import {TwitterService} from '../../../services/twitter.service';
import {FacebookService} from '../../../services/facebook.service';

@Component({
  styleUrls: ['./profile-stats.component.scss'],
  templateUrl: './profile-stats.component.html',
})
export class ProfileStatsComponent {

  /**
   * User data.
   */
  user: any;

  /**
   * All filters. The same filter can be used in more visualization type.
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
    },
    filterConnection: {
      name: 'Source',
      source: 'all',
      sources: ['all', 'facebook', 'twitter', 'phone contact'],
    },
    filterLimit: {
      name: 'Limit',
      limit: null,
    }

    // TODO add here new filters
  };

  /**
   * All available visualization.
   * Add here new visualizations to display them on the view.
   */
  visualizations = [{
    name: 'Personal Data Summary',
    id: 'personaldata-source',
    description: 'This is a summary of the different kind of data we have extracted from your identities',
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
    description: 'This view shows your network usage (bytes received, bytes transmitted, etc.)',
    types: [
      {
        name: 'barchart',
        id: 'bar',
        filters: [this.filters.filterDate],
      },
      {
        name: 'timeline',
        id: 'spline',
        filters: [this.filters.filterDate],
      },
    ]
  }, {
    name: 'App Usage',
    id: 'personaldata-appinfo',
    description: 'This view shows the apps you frequently use (foreground time)',
    types: [
      {
        name: 'barchart',
        id: 'bar',
        filters: [this.filters.filterDate, this.filters.filterCategory],
      },
      {
        name: 'timeline',
        id: 'spline',
        filters: [this.filters.filterDate],
      },
    ]
  }, {
    name: 'GPS Positions',
    id: 'personaldata-gps',
    description: 'This view shows your movements, based on your GPS coordinates (S= Start Position, E=End Position)',
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
    description: 'This view shows some statistics about the usage of your devices (Total On/Off time)',
    types: [
      {
        name: 'barchart',
        id: 'bar',
        filters: [this.filters.filterDate],
      },
    ]
  }, {
    name: 'Posts',
    id: 'messages-list',
    description: 'This view shows the posts your have shared on social networks',
    types: [
      {
        name: 'list',
        id: 'list',
        filters: [this.filters.filterMessage, this.filters.filterLimit],
      },
    ]
  }, {
    name: 'Likes',
    id: 'likes-list',
    description: 'This view shows the pages you like',
    types: [
      {
        name: 'list',
        id: 'list',
        filters: [this.filters.filterDate, this.filters.filterLimit],
      },
    ]
  }, {
    name: 'Connections',
    id: 'connections-list',
    description: 'This view shows the connections we have extracted from your device or from your social networks',
    types: [
      {
        name: 'list',
        id: 'list',
        filters: [this.filters.filterConnection, this.filters.filterLimit],
      },
    ]
  }, {
    name: 'Activities',
    id: 'activities-list',
    description: 'This view shows the activities detected by your device',
    types: [
      {
        name: 'list',
        id: 'list',
        filters: [this.filters.filterDate],
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

  /**
   * User likes.
   */
  likes: any;

  /**
   * User connections (Facebook friends, Twitter followings/followers, phone contacts, etc).
   */
  connections: any;

  /**
   * Android user activities detected by sensors.
   */
  activities: any;

  constructor(
    private statsService: StatsService,
    private authService: AuthService,
    private facebookService: FacebookService,
    private twitterService: TwitterService,
  ) {
    this.user = authService.getCachedUser();
    this.chartsLoading = false;
  }

  /**
   * Remove selected type and filters.
   */
  clearFilter() {
    if (this.selected.visualization) {

      // set the first type as default
      this.selected.type = this.selected.visualization.types[0];
      this.updateChart();
    } else {

      // clear visualization
      this.selected = {visualization: null, type: null};
      this.customChart = null;
      this.chartsLoading = false;
      this.socialMessages = null;
      this.gpsCoordinate = null;
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
    this.chartsLoading = true;
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
      case 'likes-list':
        this.buildLikesList();
        break;
      case 'connections-list':
        this.buildConnectionsList();
        break;
      case 'activities-list':
        this.buildActivitiesList();
        break;
      default:
        this.customChart = null;
        this.chartsLoading = false;
        this.socialMessages = null;
        this.gpsCoordinate = null;
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
    const messagesNumber = this.filters.filterLimit.limit || 1000;

    switch (this.filters.filterMessage.source) {
      case 'twitter':
        this.twitterService.timeline(messagesNumber).subscribe((res) => {
          if (res.messages && res.messages.length) {
            res.messages = res.messages.map(message => {
              return {
                text: message.text,
                story: message.story,
                date: new Date(message.date).toLocaleDateString(),
                source: 'twitter',
              };
            });
            this.socialMessages = res.messages;
          }
        });
        break;
      case 'facebook':
        this.facebookService.userPosts(messagesNumber).subscribe((res) => {
          if (res.messages && res.messages.length) {
            res.messages = res.messages.map(message => {
              return {
                text: message.text,
                story: message.story,
                date: new Date(message.date).toLocaleDateString(),
                source: 'facebook',
              };
            });
            this.socialMessages = res.messages;
          }
        });
        break;
      default:
        this.facebookService.userPosts(messagesNumber / 2).subscribe((res) => {
          if (res.messages && res.messages.length) {
            res.messages = res.messages.map(message => {
              return {
                text: message.text,
                story: message.story,
                date: new Date(message.date).toLocaleDateString(),
                source: 'facebook',
              };
            });
            res.messages.forEach((message) => {
              this.socialMessages.push(message);
            });
          }
        });
        this.twitterService.timeline(messagesNumber / 2).subscribe((res) => {
          if (res.messages && res.messages.length) {
            res.messages = res.messages.map(message => {
              return {
                text: message.text,
                story: message.story,
                date: new Date(message.date).toLocaleDateString(),
                source: 'twitter',
              };
            });
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

  /**
   * Build the user likes list.
   */
  private buildLikesList() {
    this.likes = [];
    const filters = {
      dateFrom: this.filters.filterDate.dateFrom,
      dateTo: this.filters.filterDate.dateTo,
      limitResult: this.filters.filterLimit.limit,
    };
    this.facebookService.likes(filters.limitResult || 1000, filters.dateFrom, filters.dateTo).subscribe(
      (res) => {
        this.chartsLoading = false;
        if (res.likes && res.likes.length) {
          this.likes = res.likes;
        }
      },
      (err) => {
        this.chartsLoading = false;
      }
    );
  }

  /**
   * Build the user connections list.
   */
  private buildConnectionsList() {
    this.connections = [];
    switch (this.filters.filterConnection.source) {
      case 'facebook':
        this.getFacebookFriends(this.filters.filterLimit.limit || 1000);
        break;
      case 'twitter':
        this.getTwitterFriends(this.filters.filterLimit.limit || 1000);
        break;
      case 'android':
        this.getAndroidContacts(this.filters.filterLimit.limit || 1000);
        break;
      default:
        this.getFacebookFriends(this.filters.filterLimit.limit || 1000);
        this.getTwitterFriends(this.filters.filterLimit.limit || 1000);
        this.getAndroidContacts(this.filters.filterLimit.limit || 1000);
        break;
    }
  }

  /**
   * Get Facebook friends.
   * @param number: the friends number
   */
  private getFacebookFriends(number: number) {
    this.facebookService.friends(number).subscribe(
      (res) => {
        if (res.friends && res.friends.length > 0) {
          this.connections = res.friends;
        }
      }
    );
  }

  /**
   * Get Twitter friends (followers and followings)
   * @param number: the friends number
   */
  private getTwitterFriends(number: number) {
    this.twitterService.friends(number).subscribe(
      (res) => {
        if (res.friends && res.friends.length > 0) {
          this.connections = res.friends;
        }
      }
    );
  }

  /**
   * Get Android contacts.
   * @param number: the contacts number
   */
  private getAndroidContacts(number: number) {
    this.statsService.getAndroidContactStats({limitResults: number}).then(
      (res) => {
        if (res.length) {
          this.connections = res;
        }
      }
    );
  }

  /**
   * Build the activities list (android activity).
   */
  private buildActivitiesList() {
    const filters = {
      dateFrom: this.filters.filterDate.dateFrom,
      dateTo: this.filters.filterDate.dateTo,
    };
    this.statsService.getActivityData(filters).then(
      (res) => {
        if (res && res.length) {
          this.activities = res;
        }
      }
    );
  }

}
