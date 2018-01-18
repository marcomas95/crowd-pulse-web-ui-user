import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

const API_LOGIN_DIALOG = 'api/linkedin/login_dialog';
const API_REQUEST_TOKEN = 'api/linkedin/request_token';
const API_USER_PROFILE = 'api/linkedin/profile';

@Injectable()
export class LinkedinService {

  private url: string;

  constructor(
    private http: HttpClient,
  ) {
    this.url = environment.api;
  }

  /**
   * Get the login dialog.
   * @return{Observable<Object>}: loginDialogUrl data
   */
  getLoginDialog(): Observable<any> {
    const postParams = {
      callbackUrl: environment.linkedinCallbackUrl,
    };
    return this.http.post(this.url + API_LOGIN_DIALOG, postParams);
  }

  /**
   * Get the access token.
   * @param authorizationCode: authorization code returned by LinkedIn
   * @return{Observable<Object>}: LinkedIn user accessToken
   */
  accessToken(authorizationCode: string): Observable<any> {
    const postParams = {
      code: authorizationCode,
      callbackUrl: environment.linkedinCallbackUrl,
    };
    return this.http.post(this.url + API_REQUEST_TOKEN, postParams);
  }

  /**
   * Get user profile information.
   * @param accessToken: the access token
   * @return{Observable<Object>}: LinkedIn user profile information
   */
  userProfile(accessToken: string): Observable<any> {
    const postParams = {
      accessToken: accessToken,
    };
    return this.http.post(this.url + API_USER_PROFILE, postParams);
  }

}
