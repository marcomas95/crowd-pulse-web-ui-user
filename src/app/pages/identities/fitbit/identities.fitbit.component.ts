import {Component} from '@angular/core';
import {environment} from '../../../../environments/environment';

@Component({
  templateUrl: './identities.fitbit.component.html'
})
export class IdentitiesFitbitComponent {

  /**
   * Application name.
   */
  appName: string;

  constructor() {
    this.appName = environment.appName;
  }

}
