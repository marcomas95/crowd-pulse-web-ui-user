import {Component, Input, OnInit} from '@angular/core';
import {StatsService} from '../../../../services/stats.service';
import {CloudData, CloudOptions} from 'angular-tag-cloud-module';

@Component({
  selector: 'app-profile-interests',
  styleUrls: ['./profile-data-interest.component.scss'],
  templateUrl: './profile-data-interest.component.html'
})
export class ProfileDataInterestComponent implements OnInit {

  /**
   * The user profile (logged or not).
   */
  @Input() user: any;

  /**
   * WordCloud data.
   */
  data: CloudData[];

  /**
   * WordCloud options.
   */
  options: CloudOptions = {
    width : 1,
    height : 400,
    overflow: true,
  };

  /**
   * Available interest source.
   */
  sources = [{
    id: null,
    name: 'All',
  }, {
    id: 'message_token',
    name: 'Token',
  }, {
    id: 'message_tag_category',
    name: 'Tag Category',
  }, {
    id: 'like',
    name: 'Like',
  }, {
    id: 'app_category',
    name: 'App Category',
  },

    // TODO add here new source type
  ];

  /**
   * Filter available.
   */
  filter = {
    dateFrom: null,
    dateTo: null,
    source: this.sources[0].id,
  };


  constructor(
    private statsService: StatsService,
  ) {}

  /**
   * @override
   */
  ngOnInit() {

    // get word cloud interests data
    this.statsService.getInterestsStats().then((stats) => {
      this.data = stats.map((data) => {
        return {
          weight: data.weight,
          text: data.value,
        };
      });
    });
  }

  /**
   * Update chart with filter value.
   */
  updateChart() {
    this.statsService.getInterestsStats(this.filter).then((stats) => {
      this.data = stats.map((data) => {
        return {
          weight: data.weight,
          text: data.value,
        };
      });
    });
  }

}
