import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

const API_LOGIN_DIALOG = 'api/facebook/login_dialog';


@Injectable()
export class FitbitService {

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
      callbackUrl: environment.fitbitCallbackUrl,
    };
    return this.http.post(`${this.url}${API_LOGIN_DIALOG}`, postParams);
  }

}
