import {Component, OnInit} from '@angular/core';
import {APP_ROUTES} from '../../app-routes';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  styleUrls: ['./profile.component.scss'],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  profileTabItems = [
    {
      name: 'General',
      icon: 'fa fa-list fa-1x',
      path: APP_ROUTES.profile.general
    },
    {
      name: 'Statistics',
      icon: 'fa fa-bar-chart fa-1x',
      path: APP_ROUTES.profile.stats
    },
  ];

  userImage: string;
  user: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private toast: ToastrService,
  ) { }

  /**
   * @override
   */
  ngOnInit() {
    this.userImage = './../../../../assets/images/user-image.png';

    // reading username from the URL
    this.getUsernameParam().then((username) => {
      this.getUserInfo(username);
    });

  }

  private getUsernameParam(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.route.params.subscribe(params => {
        const username = params['username'];
        if (!username) {
          this.router.navigateByUrl(APP_ROUTES.home);
          reject();
        } else {
          resolve(username);
        }
      });
    });
  }

  private getUserInfo(username: string) {

    /*
     TODO use the username to look up user information calling a specific Web API that understand if the user
     is the current logged user
     */

    if (username === this.authService.getUserame()) {
      this.authService.getUser().then(
        (user) => {
          this.router.navigateByUrl(`${APP_ROUTES.profile.root}/${username}/${APP_ROUTES.profile.general}`);
          this.user = user;
          this.userImage = user.pictureUrl ? user.pictureUrl : './../../../../assets/images/user-image.png';
        },
        (err) => {
          this.toast.error('Cannot load user data. Try again later.');
          this.router.navigateByUrl(APP_ROUTES.home);
        }
      );
    } else {

      // TODO profileService.getProfile(username), that filter user profile information and show only data with given permissions
    }
  }
}
