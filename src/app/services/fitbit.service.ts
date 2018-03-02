import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {isNullOrUndefined} from 'util';

const API_LOGIN_DIALOG = 'api/fitbit/login_dialog';
const API_REQUEST_TOKEN = 'api/fitbit/request_token';
const API_USER_PROFILE = 'api/fitbit/profile';
const API_DELETE_ACCOUNT = 'api/fitbit/delete';
const API_CONFIG = 'api/fitbit/config';

const FIVE_MINUTES_MILLIS = 5 * 60 * 1000;

@Injectable()
export class FitbitService {

  private url: string;

  // timeout variables
  private lastUpdateProfile: number;
  private lastUpdatePosts: number;
  private lastUpdateLikes: number;
  private lastUpdateFriends: number;

  constructor(
    private http: HttpClient,
  ) {
    this.url = environment.api;
    this.lastUpdateProfile = Date.now() - FIVE_MINUTES_MILLIS;
    this.lastUpdatePosts = Date.now() - FIVE_MINUTES_MILLIS;
    this.lastUpdateLikes = Date.now() - FIVE_MINUTES_MILLIS;
    this.lastUpdateFriends = Date.now() - FIVE_MINUTES_MILLIS;
  }

  /**
   * Get the login dialog.
   * @return{Observable<Object>}: loginDialogUrl data
   */
  getLoginDialog(): Observable<any> {
    const postParams = {
      callbackUrl: environment.fitbitCallbackUrl,
    };
    return this.http.post(`${this.url}${API_LOGIN_DIALOG}`, postParams);
  }

  /**
   * Get the access token.
   * @param authorizationCode: authorization code returned by Fitbit
   * @return{Observable<Object>}: Fitbit user accessToken
   */
  accessToken(authorizationCode: string): Observable<any> {
    const postParams = {
      code: authorizationCode,
      callbackUrl: environment.fitbitCallbackUrl,
    };
    return this.http.post(`${this.url}${API_REQUEST_TOKEN}`, postParams);
  }

  /**
   * Get user profile information.
   * @return{Observable<Object>}: Fitbit user profile information if request was sent, false otherwise
   */
  profile(): Observable<any> {
    // timeout
    if (Date.now() - this.lastUpdateProfile >= FIVE_MINUTES_MILLIS) {
      this.lastUpdateProfile = Date.now();
      return this.http.get(`${this.url}${API_USER_PROFILE}`);
    } else {
      return Observable.of(false);
    }
  }

  /**
   * Get user posts.
   * @param messagesToRead: the number of messages to retrieve from database. If not specified, update the user messages
   *        with new ones
   * @return{Observable<Object>}: Fitbit user posts if request was sent, false otherwise
   */


 /*TODO*/

  /**
   * Get user likes.
   * @param likesToRead the number of likes to retrieve from database. If not specified, update the user likes
   *        with new ones
   * @return {Observable<Object>}: Fitbit user likes if request was sent, false otherwise
   */


  /*TODO*/


  /**
   * Get user friends.
   * @param friendsToRead the number of friends to retrieve from database. If not specified, update the user friends
   * @return {Observable<Object>}: Fitbit user friends if request was sent, false otherwise
   */

  /*TODO*/


  /**
   * Send Fitbit configuration to update.
   * @param option: share options
   * @return {Observable<Object>}
   */
  configuration(option: {shareProfile?: boolean, shareMessages?: boolean, shareFriends?: boolean, shareLikes?: boolean}): Observable<any> {
    let params = '?';

    if (!isNullOrUndefined(option.shareProfile)) {
      params += 'shareProfile=' + option.shareProfile + '&';
    }

    if (!isNullOrUndefined(option.shareMessages)) {
      params += 'shareMessages=' + option.shareMessages + '&';
    }

    if (!isNullOrUndefined(option.shareFriends)) {
      params += 'shareFriends=' + option.shareFriends + '&';
    }

    if (!isNullOrUndefined(option.shareLikes)) {
      params += 'shareLikes=' + option.shareLikes + '&';
    }

    return this.http.get(`${this.url}${API_CONFIG}${params}`);
  }

  /**
   * Delete user Fitbit account.
   * @return {Observable<Object>}
   */
  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.url}${API_DELETE_ACCOUNT}`);
  }
}
