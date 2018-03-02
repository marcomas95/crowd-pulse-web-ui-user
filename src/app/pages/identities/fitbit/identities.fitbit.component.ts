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
   * True if something is loading.
   */
  loading = true;

  /**
   * True if posts are loading.
   */
  loadingPosts = false;

  /**
   * True if likes are loading.
   */
  loadingLikes = false;

  /**
   * True if friends are loading.
   */
  loadingFriends = false;

  /**
   * Posts array.
   */
  posts: any[] = [];

  /**
   * Likes array.
   */
  likes: any[] = [];

  /**
   * Friends array.
   */
  friends: any[] = [];

  /**
   * Share profile option.
   */
  shareProfile: boolean;

  /**
   * Share messages option.
   */
  shareMessages: boolean;

  /**
   * Share friends option.
   */

  shareFriends: boolean;

  /**
   * Share likes option.
   */
  shareLikes: boolean;

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
       /*  this.updatePosts(10);*/
        /* this.updateLikes(10);*/
        /* this.updateFriends(10);*/

        // set share values
        this.shareProfile = this.user.identities.configs.fitbitConfig.shareProfile;
      /*  this.shareMessages = this.user.identities.configs.fitbitConfig.shareMessages;
        this.shareFriends = this.user.identities.configs.fitbitConfig.shareFriends;
        this.shareLikes = this.user.identities.configs.fitbitConfig.shareLikes;*/

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
   * Update user Posts.
   * @param messagesToRead: the messages number to retrieve
   * @param showToast: if you want to show the toast messages
   */

  /*TODO*/


  /**
   * Update user likes.
   * @param likesToRead: the likes number to retrieve
   * @param showToast: if you want to show the toast messages
   */

  /*TODO*/


  /**
   * Update user friends.
   * @param friendsToRead: the friends number to retrieve
   * @param showToast: if you want to show the toast messages
   */

  /*TODO*/


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
   * Update share messages.
   */
  updateShareMessages() {
    this.fitbitService.configuration({shareMessages: this.shareMessages}).subscribe((res) => {
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
   * Update share likes.
   */
  updateShareLikes() {
    this.fitbitService.configuration({shareLikes: this.shareLikes}).subscribe((res) => {
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
    fitbitProfile.push({dataName: 'Full Name', dataValue: fitbit['fullName']});
    fitbitProfile.push({dataName: 'aboutMe', dataValue: fitbit['aboutMe']});
    fitbitProfile.push({dataName: 'Gender', dataValue: fitbit['gender']});
    fitbitProfile.push({dataName: 'country', dataValue: fitbit['country']});
    fitbitProfile.push({dataName: 'weight', dataValue: fitbit['weight']});
    fitbitProfile.push({dataName: 'state', dataValue: fitbit['state']});
    fitbitProfile.push({dataName: 'dateOfBirth', dataValue: fitbit['dateOfBirth']});
    fitbitProfile.push({dataName: 'height', dataValue: fitbit['height']});
    fitbitProfile.push({dataName: 'city', dataValue: fitbit['city']});
    fitbitProfile.push({dataName: 'displayName', dataValue: fitbit['displayName']});
    this.dataSource = new MatTableDataSource(fitbitProfile);
  }
}
