import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {APP_ROUTES} from '../../app-routes';

@Component({
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  /**
   * Status variable. True if login form is on the screen.
   */
  loginForm: boolean;

  /**
   * APP_ROUTES used in the UI.
   */
  appRoutes = APP_ROUTES;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = true;
  }

  /**
   * @override
   */
  ngOnInit() {

    // user is not authenticated in
    if (this.authService.getSessionToken()) {

      // login page
      this.router.navigateByUrl(APP_ROUTES.identities.root);
    }
  }

  /**
   * Shows the login form.
   * @param isLoginForm: value given by the signup component on the 'Login' button
   */
  showLoginForm(isLoginForm) {
    this.loginForm = isLoginForm;
  }

  /**
   * Shows the signup form.
   * @param isLoginForm: value given by the login component on the 'Sign Up' button
   */
  showSignupForm(isLoginForm) {
    this.loginForm = !isLoginForm;
  }
}