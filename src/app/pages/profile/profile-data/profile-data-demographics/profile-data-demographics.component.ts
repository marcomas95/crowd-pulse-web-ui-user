import {Component, Input, OnInit} from '@angular/core';
import {ProfileService} from '../../../../services/profile.service';
import {MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-profile-demographics',
  styleUrls: ['./../profile-data.component.scss'],
  templateUrl: './profile-data-demographics.component.html'
})
export class ProfileDataDemographicsComponent implements OnInit {

  /**
   * The user profile (logged or not).
   */
  @Input() user: any;

  // data source containing user demographics user profile data
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['dataName', 'dataValue'];


  /**
   * @override
   */
  ngOnInit() {
    if (this.user.demographics) {
      this.setupDemographicsProfileTable();
    }
  }

  /**
   * Populate the dataSource object reading the demographics element from user profile.
   */
  private setupDemographicsProfileTable() {
    const demographics = this.user.demographics;

    // array used to populate the data source object
    const demographicsData: {dataName: string, dataValue: any}[] = [];

    // catch the name
    if (demographics.name) {
      demographicsData.push({dataName: 'Full Name', dataValue: demographics.name.value});
    }

    // catch location
    if (demographics.location && demographics.location.length > 0) {
      demographicsData.push({
        dataName: 'Last location',
        dataValue: demographics.location.sort((a, b) => b.timestamp - a.timestamp)[0].value
      });
    }

    // catch gender
    if (demographics.gender) {
      demographicsData.push({dataName: 'Gender', dataValue: demographics.gender.value});
    }

    // catch emails
    if (demographics.email) {
      const emails = [];
      const emailSortedArray = demographics.email.sort((a, b) => b.timestamp - a.timestamp);
      for (const email of emailSortedArray) {

        // only the last emails with the same timestamp
        if (email.timestamp === emailSortedArray[0].timestamp) {
          emails.push(email.value);
        }
      }
      if (emails.length) {
        demographicsData.push({dataName: 'Email(s)', dataValue: emails});
      }
    }

    // catch languages
    if (demographics.language) {
      const languages = [];
      const languageSortedArray = demographics.language.sort((a, b) => b.timestamp - a.timestamp);

      for (const language of languageSortedArray) {

        // only the last languages with the same timestamp and different value
        if (language.timestamp === languageSortedArray[0].timestamp ) {
          languages.push(language.value);
        }
      }
      if (languages.length) {
        demographicsData.push({dataName: 'Language(s)', dataValue: languages});
      }
    }

    // catch work
    if (demographics.work && demographics.work.length > 0) {
      demographicsData.push({
        dataName: 'Last Work',
        dataValue: demographics.work.sort((a, b) => b.timestamp - a.timestamp)[0].value
      });
    }

    // catch industry
    if (demographics.industry && demographics.industry.length > 0) {
      demographicsData.push({
        dataName: 'Industry',
        dataValue: demographics.industry.sort((a, b) => b.timestamp - a.timestamp)[0].value
      });
    }

    // catch devices
    if (demographics.device && demographics.device.length > 0) {
      const devices = [];
      const devicesSortedArray = demographics.device.sort((a, b) => b.timestamp - a.timestamp);

      for (const device of devicesSortedArray) {

        // only the last devices with the same timestamp and different value
        if (device.timestamp === devicesSortedArray[0].timestamp ) {
          // device.push(device.brand + '-' + device.model);
        }
      }
      if (devices.length) {
        demographicsData.push({dataName: 'Device(s)', dataValue: devices});
      }
    }

    // TODO add here other demographics fields

    this.dataSource = new MatTableDataSource(demographicsData);
  }

}
