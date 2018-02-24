import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-profile-cognitive-aspects',
  styleUrls: ['./../profile-data.component.scss'],
  templateUrl: './profile-data-cognitive-aspects.component.html'
})
export class ProfileDataCognitiveAspectsComponent {

  /**
   * The user profile (logged or not).
   */
  @Input() user: any;

}
