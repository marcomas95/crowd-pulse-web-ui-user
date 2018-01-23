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

  /**
   * Tab menu items.
   */
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

  /**
   * User image path.
   */
  userImage: string;

  /**
   * The current logged user.
   */
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
    this.userImage = 'assets/images/user-image.png';

    // reading username from the URL
    this.getUsernameParam().then((username) => {
      this.getUserInfo(username);
    });

  }

  /**
   * Read username from url.
   * @return {Promise<String>}: the username
   */
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

  /**
   * Get user information. If the user is not the current logged one, retrieve the information of the user with specified
   * username in the URL.
   * @param username: the user name
   */
  private getUserInfo(username: string) {
    if (username === this.authService.getUserame()) {
      this.authService.getUser().then(
        (user) => {
          this.router.navigateByUrl(`${APP_ROUTES.profile.root}/${username}/${APP_ROUTES.profile.general}`);
          this.user = user;
          this.userImage = user.pictureUrl ? user.pictureUrl : 'assets/images/user-image.png';
        }
      );
    } else {

      // TODO profileService.getProfile(username), that filter user profile information and show only data with given permissions
    }
  }
}
