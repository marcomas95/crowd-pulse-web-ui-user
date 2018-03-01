import {Component, Input, OnInit} from '@angular/core';
import {StatsService} from '../../../../services/stats.service';
import {CloudData, CloudOptions, ZoomOnHoverOptions} from 'angular-tag-cloud-module';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-profile-interests',
  styleUrls: ['./../profile-data.component.scss'],
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
    overflow: false,
  };

  /**
   * Zoom WordCloud option.
   */
  zoomOnHoverOptions: ZoomOnHoverOptions = {
    scale: 1.3,
    transitionTime: 0.5,
    delay: 0
  };

  /**
   * Available interest source.
   */
  sources = [{
    id: null,
    name: 'All',
  }, {
    id: 'message_token',
    name: 'Social Hashtag',
  }, {
    id: 'message_tag',
    name: 'Tag',
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
    dateFrom: new Date(),
    dateTo: new Date(),
    source: this.sources[4].id,
  };

  /**
   * Application name.
   */
  appName = environment.appName;

  constructor(
    private statsService: StatsService,
  ) {}

  /**
   * @override
   */
  ngOnInit() {

    // get word cloud interests data
    this.statsService.getInterestsStats(this.filter).then((stats) => {
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
