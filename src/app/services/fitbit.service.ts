import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {isNullOrUndefined} from 'util';

const API_LOGIN_DIALOG = 'api/fitbit/login_dialog';
const API_REQUEST_TOKEN = 'api/fitbit/request_token';

const API_USER_PROFILE = 'api/fitbit/profile';
const API_USER_ACTIVITY = 'api/fitbit/activity';
const API_USER_BODY_WEIGHT = 'api/fitbit/body_weight';
const API_USER_DEVICES = 'api/fitbit/devices';
const API_USER_FOOD = 'api/fitbit/food';
const API_USER_FRIENDS = 'api/fitbit/friends';
const API_USER_HEARTRATE = 'api/fitbit/heartrate';
const API_USER_SLEEP = 'api/fitbit/sleep';

const API_DELETE_ACCOUNT = 'api/fitbit/delete';
const API_CONFIG = 'api/fitbit/config';

const FIVE_MINUTES_MILLIS = 5 * 60 * 1000;

@Injectable()
export class FitbitService {

  private url: string;

  // timeout variables
  private lastUpdateProfile: number;
  private lastUpdateActivity: number;
  private lastUpdateBody_Weight: number;
  private lastUpdateDevices: number;
  private lastUpdateFood: number;
  private lastUpdateFriends: number;
  private lastUpdateHeartRate: number;
  private lastUpdateSleep: number;

  constructor(
    private http: HttpClient,
  ) {
    this.url = environment.api;
    this.lastUpdateProfile = Date.now() - FIVE_MINUTES_MILLIS;
    this.lastUpdateActivity = Date.now() - FIVE_MINUTES_MILLIS;
    this.lastUpdateBody_Weight = Date.now() - FIVE_MINUTES_MILLIS;
    this.lastUpdateFood = Date.now() - FIVE_MINUTES_MILLIS;
    this.lastUpdateProfile = Date.now() - FIVE_MINUTES_MILLIS;
    this.lastUpdateFriends = Date.now() - FIVE_MINUTES_MILLIS;
    this.lastUpdateHeartRate = Date.now() - FIVE_MINUTES_MILLIS;
    this.lastUpdateSleep = Date.now() - FIVE_MINUTES_MILLIS;
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
   * Get user Activity.
   * @return{Observable<Object>}: Fitbit user activity if request was sent, false otherwise
   */
  userActivity(): Observable<any>  {
    // timeout
    if (Date.now() - this.lastUpdateActivity >= FIVE_MINUTES_MILLIS) {
      this.lastUpdateActivity = Date.now();
      return this.http.get(`${this.url}${API_USER_ACTIVITY}`);
    } else {
      return Observable.of(false);
    }
  }


  /**
   * Get user Body & Weight.
   * @return{Observable<Object>}: Fitbit user body & weight if request was sent, false otherwise
   */
  userBody_Weight(): Observable<any>  {
    // timeout
    if (Date.now() - this.lastUpdateBody_Weight >= FIVE_MINUTES_MILLIS) {
      this.lastUpdateBody_Weight = Date.now();
      return this.http.get(`${this.url}${API_USER_BODY_WEIGHT}`);
    } else {
      return Observable.of(false);
    }
  }


  /**
   * Get user Devices.
   * @return{Observable<Object>}: Fitbit devices if request was sent, false otherwise
   */
  userDevices(): Observable<any>  {
    // timeout
    if (Date.now() - this.lastUpdateDevices >= FIVE_MINUTES_MILLIS) {
      this.lastUpdateDevices = Date.now();
      return this.http.get(`${this.url}${API_USER_DEVICES}`);
    } else {
      return Observable.of(false);
    }
  }


  /**
   * Get user Food.
   * @return{Observable<Object>}: Fitbit user Food if request was sent, false otherwise
   */
  userFood(): Observable<any>  {
    // timeout
    if (Date.now() - this.lastUpdateFood >= FIVE_MINUTES_MILLIS) {
      this.lastUpdateFood = Date.now();
      return this.http.get(`${this.url}${API_USER_FOOD}`);
    } else {
      return Observable.of(false);
    }
  }


  /**
   * Get user Friends.
   * @return{Observable<Object>}: Fitbit user Friends if request was sent, false otherwise
   */
  userFriends(): Observable<any>  {
    // timeout
    if (Date.now() - this.lastUpdateFriends >= FIVE_MINUTES_MILLIS) {
      this.lastUpdateFriends = Date.now();
      return this.http.get(`${this.url}${API_USER_FRIENDS}`);
    } else {
      return Observable.of(false);
    }
  }


  /**
   * Get user Heart Rate.
   * @return{Observable<Object>}: Fitbit user Heart Rate if request was sent, false otherwise
   */
  userHeartRate(): Observable<any>  {
    // timeout
    if (Date.now() - this.lastUpdateHeartRate >= FIVE_MINUTES_MILLIS) {
      this.lastUpdateHeartRate = Date.now();
      return this.http.get(`${this.url}${API_USER_HEARTRATE}`);
    } else {
      return Observable.of(false);
    }
  }

  /**
   * Get user Sleep.
   * @return{Observable<Object>}: Fitbit user Sleep if request was sent, false otherwise
   */
  userSleep(): Observable<any>  {
    // timeout
    if (Date.now() - this.lastUpdateSleep >= FIVE_MINUTES_MILLIS) {
      this.lastUpdateSleep = Date.now();
      return this.http.get(`${this.url}${API_USER_SLEEP}`);
    } else {
      return Observable.of(false);
    }
  }



  /**
   * Send Fitbit configuration to update.
   * @param option: share options
   * @return {Observable<Object>}
   */
  configuration(option: {shareProfile?: boolean, shareActivity?: boolean, shareBodyWeight?: boolean,
    shareDevices?: boolean, shareFood?: boolean, shareFriends?: boolean, shareHeartRate?: boolean, shareSleep?: boolean}): Observable<any> {
    let params = '?';

    if (!isNullOrUndefined(option.shareProfile)) {
      params += 'shareProfile=' + option.shareProfile + '&';
    }

    if (!isNullOrUndefined(option.shareActivity)) {
      params += 'shareActivity=' + option.shareActivity + '&';
    }

    if (!isNullOrUndefined(option.shareBodyWeight)) {
      params += 'shareBodyWeight=' + option.shareBodyWeight + '&';
    }

    if (!isNullOrUndefined(option.shareDevices)) {
      params += 'shareLikes=' + option.shareDevices + '&';
    }

    if (!isNullOrUndefined(option.shareFood)) {
      params += 'shareLikes=' + option.shareFood + '&';
    }

    if (!isNullOrUndefined(option.shareFriends)) {
      params += 'shareLikes=' + option.shareFriends + '&';
    }

    if (!isNullOrUndefined(option.shareHeartRate)) {
      params += 'shareLikes=' + option.shareHeartRate + '&';
    }

    if (!isNullOrUndefined(option.shareSleep)) {
      params += 'shareLikes=' + option.shareSleep + '&';
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
