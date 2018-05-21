import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-profile-physical-state',
  styleUrls: ['./../profile-data.component.scss'],
  templateUrl: './profile-data-physical-state.component.html'
})
export class ProfileDataPhysicalStateComponent {

  /**
   * The user profile (logged or not).
   */
  @Input() user: any;

}
