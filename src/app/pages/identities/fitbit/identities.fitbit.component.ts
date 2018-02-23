import {Component} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {isNullOrUndefined} from 'util';
import {ToastrService} from 'ngx-toastr';
import {FitbitService} from '../../../services/fitbit.service';

@Component({
  templateUrl: './identities.fitbit.component.html'
})
export class IdentitiesFitbitComponent {

  /**
   * Application name.
   */
  appName: string;

  constructor(
    private toast: ToastrService,
    private fitbitService: FitbitService
  ) {
    this.appName = environment.appName;
  }


  /**
   * Associate user account with Fitbit.
   */
  associate() {
    this.fitbitService.getLoginDialog().subscribe(
      (res) => {
        window.location.href = res.redirectUrl;
      },
      (err) => {
        if (!isNullOrUndefined(err.error.message)) {
          this.toast.error(err.error.message);
        } else {
          this.toast.error('Server error occurred. Try again later.');
        }
      });
  }

}
