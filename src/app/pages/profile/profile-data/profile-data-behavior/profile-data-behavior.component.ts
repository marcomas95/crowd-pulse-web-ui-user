import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-profile-behavior',
  templateUrl: './profile-data-behavior.component.html'
})
export class ProfileDataBehaviorComponent {

  /**
   * The user profile (logged or not).
   */
  @Input() user: any;

}
