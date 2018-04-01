import {Component, Input, OnInit} from '@angular/core';
import {StatsService} from '../../../../services/stats.service';
import {environment} from '../../../../../environments/environment';
import {InfoDialogComponent} from '../../../../components/info-dialog/info-dialog.component';
import {MatDialog} from '@angular/material';

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
  types = [ {
    id: 'location',
    name: 'Places',
  }, {
    id: null,
    name: 'None',
  },
  ];

  /**
   * Selected type.
   */
  selectedType: {id: string, name: string};

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
   * Update chart with filter value.
   */
  updateChart() {
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

  clickedMarker(marker: any) {
    // console.log(marker);
    let message;
    const toConvert = new Date(marker.date);
    message = 'Text: ' + marker.text + '  \nDate: ' + toConvert.toLocaleDateString() ;
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
