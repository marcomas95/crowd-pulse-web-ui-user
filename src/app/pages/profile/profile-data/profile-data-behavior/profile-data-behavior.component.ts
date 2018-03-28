import {Component, Input, OnInit} from '@angular/core';
import {StatsService} from '../../../../services/stats.service';
import {CloudData, CloudOptions, ZoomOnHoverOptions} from 'angular-tag-cloud-module';
import {environment} from '../../../../../environments/environment';

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
   * Available behavior source.
   */
  types = [{
    id: null,
    name: 'All',
  }, {
    id: 'location',
    name: 'Places',
  },
  ];

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

  data: any;

  constructor(
    private statsService: StatsService,
  ) {}

  /**
   * @override
   */
  ngOnInit(): void {
    // get word cloud interests data
    this.statsService.getMapStats(this.filter).then((stats) => {
      this.data = stats.map((data) => {
        return {
          latitude: data.latitude,
          longitude: data.longitude,
        };
      });
      // this.data = stats;
      for (let i = this.data.length - 1; i >= 0; i--) {
        if (this.data[i].latitude == null) {
          this.data.splice(i, 1);
        }
      }
    });
  }

  /**
   * Update chart with filter value.
   */
  updateChart() {
    this.statsService.getMapStats(this.filter).then((stats) => {
      this.data = stats.map((data) => {
        return {
          latitude: data.latitude,
          longitude: data.longitude,
        };
      });
      // this.data = stats;
      for (let i = this.data.length - 1; i >= 0; i--) {
        if (this.data[i].latitude == null) {
          this.data.splice(i, 1);
        }
      }
      // console.log(this.data);
    });
  }

}
