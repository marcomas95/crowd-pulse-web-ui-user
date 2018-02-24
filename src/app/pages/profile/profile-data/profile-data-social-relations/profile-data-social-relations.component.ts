import {Component, Input} from '@angular/core';
import {FacebookService} from '../../../../services/facebook.service';
import {TwitterService} from '../../../../services/twitter.service';
import {StatsService} from '../../../../services/stats.service';
import {MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-profile-social-relations',
  styleUrls: ['./../profile-data.component.scss'],
  templateUrl: './profile-data-social-relations.component.html'
})
export class ProfileDataSocialRelationsComponent {

  /**
   * The user profile (logged or not).
   */
  @Input() user: any;

  /**
   * Friends data.
   */
  data: {name: string, contatedTimes: number}[] = [];

  /**
   * Available contact types.
   */
  sources = [{
    id: null,
    name: 'All',
  }, {
    id: 'facebook',
    name: 'Facebook',
  }, {
    id: 'twitter',
    name: 'Twitter',
  }, {
    id: 'android',
    name: 'Phone Contact',
  },

    // TODO add here new source type
  ];

  /**
   * Selected source.
   */
  selectedSouce = this.sources[0].id;

  // data source containing user friends data
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['name', 'contatedTimes'];


  constructor(
    private facebookService: FacebookService,
    private twitterService: TwitterService,
    private statsService: StatsService,
  ) {}

  /**
   * Get friends by source.
   */
  getFriends() {
    switch (this.selectedSouce) {
      case 'facebook':
        this.data = [];
        this.getFacebookFriends(30);
        break;
      case 'twitter':
        this.data = [];
        this.getTwitterFriends(30);
        break;
      case 'android':
        this.data = [];
        this.getAndroidContacts(30);
        break;
      default:
        this.data = [];
        this.getFacebookFriends(30);
        this.getTwitterFriends(30);
        this.getAndroidContacts(30);
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
          res.friends.forEach((friend) => {
            this.data.push({name: friend.contactName, contatedTimes: 1});
          });
          this.data.sort((a, b) => b.contatedTimes - a.contatedTimes);
          this.dataSource = new MatTableDataSource(this.data);
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
          res.friends.forEach((friend) => {
            this.data.push({name: friend.contactName, contatedTimes: 1});
          });
          this.data.sort((a, b) => b.contatedTimes - a.contatedTimes);
          this.dataSource = new MatTableDataSource(this.data);
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
          res.forEach((contact) => {
            this.data.push({name: contact.name, contatedTimes: contact.value});
          });
          this.data.sort((a, b) => b.contatedTimes - a.contatedTimes);
          this.dataSource = new MatTableDataSource(this.data);
        }
      }
    );
  }
}
