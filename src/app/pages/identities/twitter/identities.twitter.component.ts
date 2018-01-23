import {Component, OnInit} from '@angular/core';
import {TwitterService} from '../../../services/twitter.service';
import {ToastrService} from 'ngx-toastr';
import {isNullOrUndefined} from 'util';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {environment} from '../../../../environments/environment';
import {ConfirmDialogComponent} from '../../../components/confirm-dialog/confirm-dialog.component';

const DELAY_TIMEOUT = 3500; // milliseconds

@Component({
  styleUrls: ['./identities.twitter.component.scss'],
  templateUrl: './identities.twitter.component.html',
})
export class IdentitiesTwitterComponent implements OnInit {

  /**
   * Current logged user.
   */
  user: any;

  /**
   * True if something is loading.
   */
  loading = true;

  /**
   * True if tweets are loading.
   */
  loadingTweets = false;

  /**
   * Tweets array.
   */
  tweets: any[] = [];

  /**
   * Application name.
   */
  appName: string;

  // data source containing user Twitter profile data
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['dataName', 'dataValue'];

  // variable returned by Twitter and used to complete association process
  private oauthToken: string;
  private oauthVerifier: string;

  constructor(
    private twitterService: TwitterService,
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
      if (user && user.identities && user.identities.twitter) {
        this.loading = false;
        this.user = user;
        this.setupTwitterProfileTable();
        this.updateTweets(10);

        // clean the URL
        window.history.replaceState(null, null, window.location.pathname);

      } else {

        // reading parameters returned by Twitter
        this.route.queryParams.subscribe(params => {
          this.oauthToken = params['oauth_token'];
          this.oauthVerifier = params['oauth_verifier'];

          if (this.oauthToken && this.oauthVerifier) {

            // clean the URL
            window.history.replaceState(null, null, window.location.pathname);

            // request access token
            this.twitterService.accessToken(this.oauthToken, this.oauthVerifier).subscribe((res) => {

              // update user profile
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
   * Associate user account with Twitter.
   */
  associate() {
    this.twitterService.loginWithTwitter().subscribe(
      (res) => {
        window.location.href = res.redirectUrl;
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
   * Update user Twitter profile information.
   * @param showToast: if you want to show the toast messages
   */
  updateProfile(showToast?: boolean) {
    this.twitterService.profile().subscribe((res) => {
      this.loading = false;
      if (res && res.user) {
        if (showToast) {
          this.toast.success('Profile Updated');
        }
        this.user = res.user;
        this.setupTwitterProfileTable();
      } else {
        if (showToast) {
          this.toast.warning('Timeout not elapsed. Retry in about five minutes');
        }
      }
    });
  }

  /**
   * Update user Tweets.
   * @param messagesToRead: the messages number to retrieve
   * @param showToast: if you want to show the toast messages
   */
  updateTweets(messagesToRead?: Number, showToast?: boolean) {
    this.loadingTweets = true;
    this.twitterService.timeline(messagesToRead).subscribe(
      (res) => {
        this.loadingTweets = false;
        if (res) {
          if (showToast) {
            this.toast.success('Tweets Updated');
          }
          if (res.messages && res.messages.length > 0) {
            this.tweets = res.messages;
          } else if (!messagesToRead) {
            this.loadingTweets = true;
            setTimeout(() => this.updateTweets(10), DELAY_TIMEOUT);
          }
        } else {
          if (showToast) {
            this.toast.warning('Timeout not elapsed. Retry in about five minutes');
          }
        }
      }, (err) => {
        this.loadingTweets = false;
      });
  }

  /**
   * Delete Twitter information account, including tweets.
   */
  deleteAccount() {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        infoText: 'Are you sure? All data related to your Twitter account will be deleted from ' + environment.appName
      }
    });

    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.twitterService.deleteAccount().subscribe((res) => {
          if (res.auth) {
            this.user.identities.twitter = null;
          } else {
            this.toast.error('Something went wrong.');
          }
        });
      }
    });

  }

  /**
   * Populate the dataSource object reading the element from user Twitter profile.
   */
  private setupTwitterProfileTable() {

    // user Twitter data
    const twitter = this.user.identities.twitter;

    // array used to populate the data source object
    const twitterProfile: {dataName: string, dataValue: any}[] = [];

    for (const dataName in twitter) {
      if (twitter.hasOwnProperty(dataName)) {
        twitterProfile.push({dataName: dataName, dataValue: twitter[dataName]});
      }
    }
    this.dataSource = new MatTableDataSource(twitterProfile);
  }

}
