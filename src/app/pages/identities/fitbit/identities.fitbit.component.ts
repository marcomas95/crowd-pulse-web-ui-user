import {Component, OnInit} from '@angular/core';
import {FitbitService} from '../../../services/fitbit.service';
import {isNullOrUndefined} from 'util';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {ConfirmDialogComponent} from '../../../components/confirm-dialog/confirm-dialog.component';
import {environment} from '../../../../environments/environment';

const DELAY_TIMEOUT = 3500; // milliseconds

@Component({
  styleUrls: ['./identities.fitbit.component.scss'],
  templateUrl: './identities.fitbit.component.html',
})
export class IdentitiesFitbitComponent implements OnInit {

  /**
   * Current logged user.
   */
  user: any;

  /**
   * Activity array.
   */
  activities: any[] = [];

  /**
   * Weight array.
   */
  body: any[] = [];


  /**
   * Food array.
   */
  foods: any[] = [];

  /**
   * Friends array.
   */
  friends: any[] = [];

  /**
   * Heart Rate array.
   */
  heart: any[] = [];

  /**
   * Sleep array.
   */
  sleep: any[] = [];


  /**
   * True if something is loading.
   */
  loading = true;

  /**
   * True if activity are loading.
   */
  loadingActivity = false;

  /**
   * True if body & weight are loading.
   */
  loadingBody_Weight = false;


  /**
   * True if food are loading.
   */
  loadingFood = false;

  /**
   * True if friends are loading.
   */
  loadingFriends = false;

  /**
   * True if heart rate are loading.
   */
  loadingHeartRate = false;

  /**
   * True if sleep are loading.
   */
  loadingSleep = false;

  /**
   * Share profile option.
   */
  shareProfile: boolean;

  /**
   * Share activity option.
   */
  shareActivity: boolean;

  /**
   * Share body & weight option.
   */
  shareBodyWeight: boolean;


  /**
   * Share food option.
   */
  shareFood: boolean;

  /**
   * Share friends option.
   */
  shareFriends: boolean;

  /**
   * Share heart rate option.
   */
  shareHeartRate: boolean;

  /**
   * Share sleep option.
   */
  shareSleep: boolean;

  /**
   * Application name.
   */
  appName: string;

  // data source containing user Fitbit profile data
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['dataName', 'dataValue'];

  // variable returned by Fitbit and used to complete association process
  private authorizationCode: string;

  constructor(
    private fitbitService: FitbitService,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private dialog: MatDialog,
  ) {
    this.appName = environment.appName;
  }

  /**
   * @override
   */
  ngOnInit(): void {

    this.authService.getUser().then((user) => {
      if (user && user.identities && user.identities.fitbit) {

        this.loading = false;
        this.user = user;
        this.setupFitbitProfileTable();
        this.updateFriends(10);
        this.updateSleep(10);
        this.updateFood(10);
        this.updateBody_Weight(10);
        this.updateHeartRate(10);



        // set share values
        this.shareProfile = this.user.identities.configs.fitbitConfig.shareProfile;
        this.shareFriends = this.user.identities.configs.fitbitConfig.shareFriends;
       // this.shareBodyWeight = this.user.identities.configs.fitbitConfig.shareBodyWeight;
        this.shareSleep = this.user.identities.configs.fitbitConfig.shareSleep;
        this.shareHeartRate = this.user.identities.configs.fitbitConfig.shareHeartRate;
        this.shareFood = this.user.identities.configs.fitbitConfig.shareFood;

        // clean the URL
        window.history.replaceState(null, null, window.location.pathname);

      } else {


        // reading parameters returned by Fitbit
        this.route.queryParams.subscribe(params => {
          this.authorizationCode = params['code'];

          if (this.authorizationCode) {

            // clean the URL
            window.history.replaceState(null, null, window.location.pathname);

            // request access token
            this.fitbitService.accessToken(this.authorizationCode).subscribe((res) => {

              // update Fitbit profile
              this.updateProfile();
            });
          } else {
            this.loading = false;
          }
        });
      }
    });
  }

  /**
   * Associate user account with Fitbit.
   */
  associate() {
    this.fitbitService.getLoginDialog().subscribe(
      (res) => {
        window.location.href = res.loginDialogUrl;
      },
      (err) => {
        if (!isNullOrUndefined(err.error.message)) {
          this.toast.error(err.error.message);
        } else {
          this.toast.error('Server error occurred. Try again later.');
        }
      });
  }

  /**
   * Update user Fitbit profile information.
   * @param showToast: if you want to show the toast messages
   */
  updateProfile(showToast?: boolean) {

    this.fitbitService.profile().subscribe((res) => {
      this.loading = false;
      if (res && res.user) {
        if (showToast) {
          this.toast.success('Profile Updated');
        }
        this.user = res.user;

        // set share values
        this.shareProfile = this.user.identities.configs.fitbitConfig.shareProfile;

        this.setupFitbitProfileTable();
      } else {
        if (showToast) {
          this.toast.warning('Timeout not elapsed. Retry in about five minutes');
        }
      }
    });
  }

  /**
   * Update user Activity.
   * @param showToast: if you want to show the toast messages
   */
  updateActivity(showToast?: boolean)  {

    this.fitbitService.userActivity().subscribe((res) => {
      this.loading = false;

      if (res && res.activities) {
        if (showToast) {
          this.toast.success('Activities Updated');
        }
        this.activities = res.activities;

        // set share values
        this.shareActivity = this.user.identities.configs.fitbitConfig.shareActivity;

        setTimeout(() => this.updateActivity(), DELAY_TIMEOUT);

      } else {
        if (showToast) {
          this.toast.warning('Timeout not elapsed. Retry in about five minutes');
        }
      }
    });
  }


  /**
   * Update user Body & Weight.
   * @param showToast: if you want to show the toast messages
   */
  updateBody_Weight(bodyToRead?: number, showToast?: boolean)  {



  }



  /**
   * Update user Food.
   * @param showToast: if you want to show the toast messages
   */
  updateFood(foodToRead?: number, showToast?: boolean)  {
    this.loadingFood = true;
    this.fitbitService.userFood(foodToRead).subscribe(
      (res) => {
        this.loadingFood = false;
        if (res) {
          if (showToast) {
            this.toast.success('Food Updated');
          }
          if (res.foods && res.foods.length > 0) {
            this.foods = res.foods;
            this.toast.success('entrato');

          } else if (!foodToRead) {
            this.loadingFood = true;
            setTimeout(() => this.updateFood(10), DELAY_TIMEOUT);
          }
        } else {
          if (showToast) {
            this.toast.warning('Timeout not elapsed. Retry in about five minutes');
          }
        }
      },
      (err) => {
        this.loadingFood = false;
      });
  }


  /**
   * Update user Friends.
   * @param showToast: if you want to show the toast messages
   */
  updateFriends(friendsToRead?: number, showToast?: boolean)  {
    this.loadingFriends = true;
    this.fitbitService.userFriends(friendsToRead).subscribe(
      (res) => {
        this.loadingFriends = false;
        if (res) {
          if (showToast) {
            this.toast.success('Friend Updated');
          }
          if (res.friends && res.friends.length > 0) {
            this.friends = res.friends;

          } else if (!friendsToRead) {
            this.loadingFriends = true;
            setTimeout(() => this.updateFriends(10), DELAY_TIMEOUT);
          }
        } else {
          if (showToast) {
            this.toast.warning('Timeout not elapsed. Retry in about five minutes');
          }
        }
      },
      (err) => {
        this.loadingFriends = false;
      });
  }


  /**
   * Update user Heart Rate.
   * @param showToast: if you want to show the toast messages
   */
  updateHeartRate(heartToRead?: number, showToast?: boolean)  {

    this.loadingHeartRate = true;
    this.fitbitService.userHeartRate(heartToRead).subscribe(
      (res) => {
        this.loadingHeartRate = false;
        if (res) {
          if (showToast) {
            this.toast.success('Heart Rate Updated');
          }
          if (res.heart && res.heart.length > 0) {
            this.heart = res.heart;
            this.toast.success('entrato');




          } else if (!heartToRead) {
            this.loadingHeartRate = true;
            setTimeout(() => this.updateHeartRate(10), DELAY_TIMEOUT);
          }
        } else {
          if (showToast) {
            this.toast.warning('Timeout not elapsed. Retry in about five minutes');
          }
        }
      },
      (err) => {
        this.loadingHeartRate = false;
      });
  }


  /**
   * Update user Sleep.
   * @param sleepToRead: the sleep number to retrieve
   * @param showToast: if you want to show the toast messages
   */
  updateSleep(sleepToRead?: number, showToast?: boolean)  {
    this.loadingSleep = true;
    this.fitbitService.userSleep(sleepToRead).subscribe(
      (res) => {
        this.loadingSleep = false;
        if (res) {
          if (showToast) {
            this.toast.success('Sleep Updated');
          }
          if (res.sleep && res.sleep.length > 0) {
            this.sleep = res.sleep;
          } else if (!sleepToRead) {
            this.loadingSleep = true;
            setTimeout(() => this.updateSleep(10), DELAY_TIMEOUT);
          }
        } else {
          if (showToast) {
            this.toast.warning('Timeout not elapsed. Retry in about five minutes');
          }
        }
      },
      (err) => {
        this.loadingSleep = false;
      });
  }



  /**
   * Update share profile.
   */
  updateShareProfile() {
    this.fitbitService.configuration({shareProfile: this.shareProfile}).subscribe((res) => {
      if (res && res.auth) {
        this.toast.success('Configuration updated');
      } else {
        this.toast.error('An error occurred');
      }
    });
  }

  /**
   * Update share activity.
   */
  updateShareActivity() {
    this.fitbitService.configuration({shareActivity: this.shareActivity}).subscribe((res) => {
      if (res && res.auth) {
        this.toast.success('Configuration updated');
      } else {
        this.toast.error('An error occurred');
      }
    });
  }

  /**
   * Update share body & weight.
   */
  updateShareBody_Weight() {
    this.fitbitService.configuration({shareBodyWeight: this.shareBodyWeight}).subscribe((res) => {
      if (res && res.auth) {
        this.toast.success('Configuration updated');
      } else {
        this.toast.error('An error occurred');
      }
    });
  }


  /**
   * Update share food.
   */
  updateShareFood() {
    this.fitbitService.configuration({shareFood: this.shareFood}).subscribe((res) => {
      if (res && res.auth) {
        this.toast.success('Configuration updated');
      } else {
        this.toast.error('An error occurred');
      }
    });
  }

  /**
   * Update share friends.
   */
  updateShareFriends() {
    this.fitbitService.configuration({shareFriends: this.shareFriends}).subscribe((res) => {
      if (res && res.auth) {
        this.toast.success('Configuration updated');
      } else {
        this.toast.error('An error occurred');
      }
    });
  }

  /**
   * Update share heart rate.
   */
  updateShareHeartRate() {
    this.fitbitService.configuration({shareHeartRate: this.shareHeartRate}).subscribe((res) => {
      if (res && res.auth) {
        this.toast.success('Configuration updated');
      } else {
        this.toast.error('An error occurred');
      }
    });
  }

  /**
   * Update share sleep.
   */
  updateShareSleep() {
    this.fitbitService.configuration({shareSleep: this.shareSleep}).subscribe((res) => {
      if (res && res.auth) {
        this.toast.success('Configuration updated');
      } else {
        this.toast.error('An error occurred');
      }
    });
  }

  /**
   * Delete Fitbit information account, including posts and likes.
   */
  deleteAccount() {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        infoText: 'Are you sure? All data related to your Fitbit account will be deleted from ' + environment.appName
      }
    });

    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.fitbitService.deleteAccount().subscribe((res) => {
          if (res.auth) {
            this.user.identities.fitbit = null;
          } else {
            this.toast.error('Something went wrong.');
          }
        });
      }
    });
  }

  /**
   * Populate the dataSource object reading the element from user Fitbit profile.
   */
  private setupFitbitProfileTable() {

    // user Fitbit data
    const fitbit = this.user.identities.fitbit;

    // array used to populate the data source object
    const fitbitProfile: {dataName: string, dataValue: any}[] = [];
    fitbitProfile.push({dataName: 'FullName', dataValue: fitbit['fullName']});
    fitbitProfile.push({dataName: 'displayName', dataValue: fitbit['displayName']});
    fitbitProfile.push({dataName: 'locale', dataValue: fitbit['locale']});
    fitbitProfile.push({dataName: 'Gender', dataValue: fitbit['gender']});
    fitbitProfile.push({dataName: 'city', dataValue: fitbit['city']});
    fitbitProfile.push({dataName: 'country', dataValue: fitbit['country']});
    fitbitProfile.push({dataName: 'state', dataValue: fitbit['state']});
    fitbitProfile.push({dataName: 'weight', dataValue: fitbit['weight']});
    fitbitProfile.push({dataName: 'weightUnit', dataValue: fitbit['weightUnit']});
    fitbitProfile.push({dataName: 'dateOfBirth', dataValue: fitbit['dateOfBirth']});
    fitbitProfile.push({dataName: 'height', dataValue: fitbit['height']});
    fitbitProfile.push({dataName: 'heightUnit', dataValue: fitbit['heightUnit']});
    this.dataSource = new MatTableDataSource(fitbitProfile);
  }
}
