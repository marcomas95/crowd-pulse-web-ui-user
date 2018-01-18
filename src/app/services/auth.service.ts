import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {LocalStorageService} from './local-storage.service';

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
    if (this.username) {
      return this.username;
    }
    return this.localStorage.getItem(USERNAME);
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
   */
  signUp(email: string, username: string, password: string): Promise<any> {
    const postParams = {
      email: email,
      username: username,
      password: password
    };
    return this.http.post(`${this.url}${API_SIGNUP}`, postParams).toPromise().then(
      (res) => {
        this.authenticated.value = true;
        this.username = username;
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
    try {
      this.localStorage.removeItem(SESSION_TOKEN);
      this.localStorage.removeItem(USERNAME);
      return Promise.resolve(true);
    } catch (err) {
      return Promise.reject(false);
    }
  }

}
