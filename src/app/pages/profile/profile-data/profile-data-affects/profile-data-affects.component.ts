import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-profile-affects',
  templateUrl: './profile-data-affects.component.html'
})
export class ProfileDataAffectsComponent {

  /**
   * The user profile (logged or not).
   */
  @Input() user: any;

}
