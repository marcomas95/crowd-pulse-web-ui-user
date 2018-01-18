import {Component, OnInit} from '@angular/core';
import {FacebookService} from '../../../services/facebook.service';
import {isNullOrUndefined} from 'util';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {MatTableDataSource} from '@angular/material';

@Component({
  styleUrls: ['./identities.facebook.component.scss'],
  templateUrl: './identities.facebook.component.html',
})
export class IdentitiesFacebookComponent implements OnInit {

  /**
   * Current logged user.
   */
  user: any;

  /**
   * True if something is loading.
   */
  loading = true;

  /**
   * Posts array.
   */
  posts: any[] = [];

  /**
   * Likes array.
   */
  likes: any[] = [];

  // data source containing user Facebook profile data
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['dataName', 'dataValue'];

  // variable returned by Facebook and used to complete association process
  private authorizationCode: string;

  constructor(
    private facebookService: FacebookService,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  /**
   * @override
   */
  ngOnInit(): void {
    this.authService.getUser().then((user) => {
      if (user && user.identities && user.identities.facebook) {
        this.loading = false;
        this.user = user;
        this.setupFacebookProfileTable();
        this.updatePosts(10);
        this.updateLikes(10);

      } else {

        // reading parameters returned by Facebook
        this.route.queryParams.subscribe(params => {
          this.authorizationCode = params['code'];

          if (this.authorizationCode) {

            // clean the URL
            window.history.replaceState(null, null, window.location.pathname);

            // request access token
            this.facebookService.accessToken(this.authorizationCode).subscribe((res) => {

              // update Facebook profile
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
   * Associate user account with Facebook.
   */
  associate() {
    this.facebookService.getLoginDialog().subscribe(
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
   * Update user Facebook profile information.
   * @param showToast: if you want to show the toast messages
   */
  updateProfile(showToast?: boolean) {
    this.facebookService.profile().subscribe((res) => {
      this.loading = false;
      if (res && res.user) {
        if (showToast) {
          this.toast.success('Profile Updated');
        }
        this.user = res.user;
        this.setupFacebookProfileTable();
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
  updatePosts(messagesToRead?: number, showToast?: boolean) {
    this.facebookService.userPosts(messagesToRead).subscribe((res) => {
      if (res) {
        if (showToast) {
          this.toast.success('Posts Updated');
        }
        if (res.messages && res.messages.length > 0) {
          this.posts = res.messages;
        } else if (!messagesToRead) {
          this.updatePosts(10);
        }
      } else {
        if (showToast) {
          this.toast.warning('Timeout not elapsed. Retry in about five minutes');
        }
      }
    });
  }

  /**
   * Update user likes.
   * @param likesToRead: the likes number to retrieve
   * @param showToast: if you want to show the toast messages
   */
  updateLikes(likesToRead?: number, showToast?: boolean) {
    this.facebookService.likes(likesToRead).subscribe((res) => {
      if (res) {
        if (showToast) {
          this.toast.success('Likes Updated');
        }
        if (res.likes && res.likes.length > 0) {
          this.likes = res.likes;
        } else if (!likesToRead) {
          this.updateLikes(10);
        }
      } else {
        if (showToast) {
          this.toast.warning('Timeout not elapsed. Retry in about five minutes');
        }
      }
    });
  }

  /**
   * Delete Facebook information account, including posts and likes.
   */
  deleteAccount() {
    this.facebookService.deleteAccount().subscribe((res) => {
      if (res.auth) {
        this.user.identities.facebook = null;
      } else {
        this.toast.error('Something went wrong.');
      }
    });
  }

  /**
   * Populate the dataSource object reading the element from user Facebook profile.
   */
  private setupFacebookProfileTable() {

    // user Twitter data
    const facebook = this.user.identities.facebook;

    // array used to populate the data source object
    const facebookProfile: {dataName: string, dataValue: any}[] = [];

    for (const dataName in facebook) {
      if (facebook.hasOwnProperty(dataName)) {
        if (facebook[dataName] instanceof Object) {
          facebookProfile.push({dataName: dataName, dataValue: JSON.stringify(facebook[dataName]).replace(/"/gi, '')});
        } else {
          facebookProfile.push({dataName: dataName, dataValue: facebook[dataName]});
        }
      }
    }
    this.dataSource = new MatTableDataSource(facebookProfile);
  }
}
