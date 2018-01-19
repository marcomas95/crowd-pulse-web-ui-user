import {Component, OnInit} from '@angular/core';
import {APP_ROUTES} from '../../app-routes';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  styleUrls: ['./identities.component.scss'],
  templateUrl: './identities.component.html'
})
export class IdentitiesComponent implements OnInit {

  /**
   * Application routes used in the UI.
   */
  appRoutes = APP_ROUTES;

  /**
   * Router used in the UI.
   */
  routedPage: Router;

  /**
   * Root page.
   */
  rootPage = `/${APP_ROUTES.identities.root}`;

  /**
   * User image.
   */
  userImage = './../../../../assets/images/user-image.png';

  /**
   * Current logged user.
   */
  user: any;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  /**
   * @override
   */
  ngOnInit() {
    this.authService.getUser().then(user => {
      this.user = user;
      this.userImage = user.pictureUrl ? user.pictureUrl : './../../../../assets/images/user-image.png';
    });
    this.routedPage = this.router;
  }

}
