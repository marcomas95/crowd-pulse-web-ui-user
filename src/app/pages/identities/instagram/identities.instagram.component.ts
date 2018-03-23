import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {MatTableDataSource} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {InstagramService} from '../../../services/instagram.service';
import {isNullOrUndefined} from 'util';
import {ToastrService} from 'ngx-toastr';
import {environment} from '../../../../environments/environment';

@Component({
  styleUrls: ['./identities.instagram.component.scss'],
  templateUrl: './identities.instagram.component.html',
})
export class IdentitiesInstagramComponent implements OnInit {

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
   * Posts array.
   */
  posts: any[] = [];

  /**
   * Share profile option.
   */
  shareProfile: boolean;

  /**
   * Share messages option.
   */
  shareMessages: boolean;

  /**
   * Application name.
   */
  appName: string;

  // data source containing user Facebook profile data
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['dataName', 'dataValue'];

  // variable returned by Instagram and used to complete association process
  private authorizationCode: string;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private instagramService: InstagramService,
    private toast: ToastrService,
  ) {
    this.appName = environment.appName;
  }

  /**
   * @Override
   */
  ngOnInit(): void {
    this.authService.getUser().then((user) => {
      if (user && user.identities && user.identities.instagram) {
        this.loading = false;
        this.user = user;
        /*
        this.setupFacebookProfileTable();
        this.updatePosts(10);
        this.updateLikes(10);
        this.updateFriends(10);
        */

        // set share values
        this.shareProfile = this.user.identities.configs.instragramConfig.shareProfile;
        this.shareMessages = this.user.identities.configs.instragramConfig.shareMessages;

        // clean the URL
        window.history.replaceState(null, null, window.location.pathname);

      } else {

        // reading parameters returned by Instagram
        this.route.queryParams.subscribe(params => {
          this.authorizationCode = params['code'];

          if (this.authorizationCode) {

            // clean the URL
            window.history.replaceState(null, null, window.location.pathname);

            // request access token
            this.instagramService.accessToken(this.authorizationCode).subscribe((res) => {

              // update Facebook profile
              // this.updateProfile();

            });
          } else {
            this.loading = false;
          }
        });
      }
    });
  }

  /**
   * Associate user account with Instagram.
   */
  associate() {
    this.instagramService.getLoginDialog().subscribe(
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
}
