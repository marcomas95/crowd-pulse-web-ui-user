import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-profile-social-relations',
  templateUrl: './profile-data-social-relations.component.html'
})
export class ProfileDataSocialRelationsComponent {

  /**
   * The user profile (logged or not).
   */
  @Input() user: any;

}
