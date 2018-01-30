import {Component} from '@angular/core';
import {environment} from '../../../environments/environment';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {APP_ROUTES} from '../../app-routes';


@Component({
  selector: 'app-navbar',
  styleUrls: ['./navbar.component.scss'],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {

  /**
   * Application name string.
   */
  appName: string;

  /**
   * Navbar links.
   */
  navbarItems = [
    {
      name: 'Identities',
      path: APP_ROUTES.identities.root,
    },
    {
      name: 'Profile',
      path: `${APP_ROUTES.profile.root}/${this.authService.getUserame()}`,
    },
    {
      name: 'People',
      path: APP_ROUTES.people,
    },
    {
      name: 'Privacy',
      path: APP_ROUTES.privacy,
    },
  ];

  constructor(
    private authService: AuthService,
    public router: Router,
  ) {
    this.appName = environment.appName;
  }

  /**
   * Performs a logout operation.
   */
  logout() {
    this.authService.logout().then(
      (res) => {
        if (res) {

          // go to login page
          this.router.navigateByUrl('');
        }
      }
    );
  }
}
