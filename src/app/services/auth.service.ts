import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {LocalStorageService} from './local-storage.service';
import {isNullOrUndefined} from 'util';

const SESSION_TOKEN = 'SESSION';
const USERNAME = 'USERNAME';

const API_LOGIN = 'auth/login';
const API_SIGNUP = 'auth/signup';
const API_GET_USER = 'api/user';

@Injectable()
export class AuthService {

  private url: string;
  private user: any;
  private username: string;

  // roles (add here more roles variables)
  private developer: boolean;

  // boolean wrapper to pass value for reference (not for value!)
  private authenticated: {value: boolean} = {
    value: false,
  };

  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService,
  ) {
    this.url = environment.api;
  }

  /**
   * Check if the user is authenticated.
   * @return {{value: boolean}}: return true if the user is correctly authenticated
   */
  isAuthenticated() {

    // solve inconsistent data
    if (!this.authenticated.value && !!this.getSessionToken()) {
      this.authenticated.value = true;
    }
    return this.authenticated;
  }

  /**
   * Returns the session JWT token.
   * @return {string|null}: the session token
   */
  getSessionToken(): string {
    return this.localStorage.getItem(SESSION_TOKEN);
  }

  /**
   * Returns the user name of the logged user.
   * @return {string|null}: the user name
   */
  getUserame(): string {
    if (!isNullOrUndefined(this.username)) {
      return this.username;
    }
    return this.localStorage.getItem(USERNAME);
  }

  /**
   * Returns the user status (developer or not).
   * @return {boolean}: true if the user is developer
   */
  isDeveloper(): Promise<boolean> {

    // if status variable is defined
    if (!isNullOrUndefined(this.developer)) {
      return Promise.resolve(this.developer);
    }

    // else get user roles reading profile information
    if (this.user) {
      this.developer = !!this.user.applicationDescription;
      return Promise.resolve(this.developer);
    } else {

      // retrieve profile information from server
      return this.getUser().then(user => {
        this.user = user;
        this.developer = !!this.user.applicationDescription;
        return Promise.resolve(this.developer);
      });
    }
  }

  /**
   * Login the user.
   * @param email: the user email
   * @param password: the user password
   */
  authentication(email: string, password: string): Promise<any> {
    const postParams = {
      email: email,
      password: password,
    };
    return this.http.post(`${this.url}${API_LOGIN}`, postParams).toPromise().then(
      (res) => {
        this.authenticated.value = true;
        this.username = res['username'];
        this.developer = res['developer'];
        this.localStorage.setItem(SESSION_TOKEN, res['token']);
        this.localStorage.setItem(USERNAME, res['username']);
        return Promise.resolve(true);
    });
  }

  /**
   * Registers a new user to the system.
   * @param email: the user email
   * @param username: the user name
   * @param password: the user password
   * @param applicationDescription: developer application description
   */
  signUp(email: string, username: string, password: string, applicationDescription?: string): Promise<any> {
    const postParams = {
      email: email,
      username: username,
      password: password,
      applicationDescription: applicationDescription,
    };
    return this.http.post(`${this.url}${API_SIGNUP}`, postParams).toPromise().then(
      (res) => {
        this.authenticated.value = true;
        this.username = username;
        this.developer = res['developer'];
        this.localStorage.setItem(SESSION_TOKEN, res['token']);
        this.localStorage.setItem(USERNAME, username);
        return Promise.resolve(true);
      },
      (err) => {
        return Promise.reject(err);
      });
  }

  /**
   * Get all user profile information for the specified username.
   */
  getUser(): Promise<any> {
    const postParams = {
      username: this.getUserame()
    };
    return this.http.post(`${this.url}${API_GET_USER}`, postParams).toPromise().then(
      (res) => {
        this.user = res;
        return Promise.resolve(res);
      },
      (err) => {
        return Promise.reject(err);
      });
  }

  /**
   * Get cached user.
   */
  getCachedUser(): any {
    return this.user;
  }

  /**
   * Performs a logout operation deleting the access token from the session storage.
   * @return {any}: true if the session token has been deleted
   */
  logout(): Promise<boolean> {
    this.authenticated.value = false;
    this.username = null;
    this.developer = null;
    try {
      this.localStorage.removeItem(SESSION_TOKEN);
      this.localStorage.removeItem(USERNAME);
      return Promise.resolve(true);
    } catch (err) {
      return Promise.reject(false);
    }
  }

}
