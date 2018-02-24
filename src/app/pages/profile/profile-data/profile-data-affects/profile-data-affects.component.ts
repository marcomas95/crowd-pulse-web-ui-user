import {Component, Input} from '@angular/core';
import {StatsService} from '../../../../services/stats.service';
import {Chart} from 'angular-highcharts';

@Component({
  selector: 'app-profile-affects',
  styleUrls: ['./../profile-data.component.scss'],
  templateUrl: './profile-data-affects.component.html'
})
export class ProfileDataAffectsComponent {

  /**
   * The user profile (logged or not).
   */
  @Input() user: any;

  /**
   * User affects data (the sentiment/emotions shown as timeline).
   */
  data: any;

  /**
   * Mood timeline chart.
   */
  moodTimelineChart: Chart;

  /**
   * Filter available.
   */
  filter = {
    dateFrom: new Date(),
    dateTo: new Date(),
  };

  /**
   * Available affect types.
   */
  types = [{
    id: null,
    name: 'None',
  }, {
    id: 'mood',
    name: 'Mood',
  }, {
    id: 'emotions',
    name: 'Emotions',
  }];

  /**
   * Selected affect type.
   */
  selectedType: {id: string, name: string};

  /**
   * User emotions.
   */
  emotions: any;


  constructor(
    private statsService: StatsService,
  ) {}

  /**
   * Update the selected chart.
   */
  updateChart() {
    if (this.selectedType.id == 'mood') {
      this.statsService.getSentimentTimelineStats(this.filter).then(
        (res) => {
          this.data = res;
          this.mapStatToTimeline(res);

          this.moodTimelineChart = new Chart({
            chart: {
              type: 'spline',
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
                text: 'Mood'
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
            series: this.data
          });
        }
      );
    } else if (this.selectedType.id == 'emotions') {

      // TODO build emtotions timeline here
    }
  }

  /**
   * Convert sentiment stats result to timeline array for correct visualization.
   * @param stats: the sentiment stats
   */
  private mapStatToTimeline(stats) {
    this.data = [];
    stats.forEach((stat) => {
      let color = '#000000';
      if (stat.name === 'positive') {
        color = '#73E639';
      } else if (stat.name === 'negative') {
        color = '#E63939';
      }

      // override stat element
      stat = {
        name: stat.name,
        data: stat.values.map(function(elem) {
          return [(new Date(elem.date)).getTime(), elem.value];
        }),
        color: color
      };

      this.data.push(stat);
    });
  }

}
