import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-profile-interests',
  templateUrl: './profile-data-interest.component.html'
})
export class ProfileDataInterestComponent {

  /**
   * The user profile (logged or not).
   */
  @Input() user: any;

}
