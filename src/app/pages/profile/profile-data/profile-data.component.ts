import {Component, OnInit} from '@angular/core';
import {APP_ROUTES} from '../../../app-routes';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {ProfileService} from '../../../services/profile.service';

@Component({
  styleUrls: ['./profile-data.component.scss'],
  templateUrl: './profile-data.component.html'
})
export class ProfileDataComponent implements OnInit {

  /**
   * Application routes used in the UI.
   */
  appRoutes = APP_ROUTES;

  /**
   * Router used in the UI.
   */
  routedPage: Router;

  /**
   * Root page.
   */
  rootPage: string;

  /**
   * Current logged user.
   */
  user: any;

  /**
   * Selected sub-page (demographics, interest, etc).
   */
  selected = '';

  /**
   * Bio fields used in the UI to make the user bio.
   */
  bioFields: {
    name?: string,
    gender?: string,
    location?: string,
    language?: string,
    email?: string,
    dateOfBirth?: string,
    height?: string,
    weight?: string,
    country?: string,

    // TODO add here more fields
  } = { };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private profileService: ProfileService,
  ) { }

  /**
   * @override
   */
  ngOnInit() {

    if (this.profileService.getCachedProfile()) {
      this.user = this.profileService.getCachedProfile();
    } else {
      this.user = this.authService.getCachedUser();
    }
    this.rootPage = `/${APP_ROUTES.profile.root}/${this.user.username}/${APP_ROUTES.profile.data}`;
    this.routedPage = this.router;

    // reading sub-page id
    this.route.queryParams.subscribe(params => {
      const dataId = params['show'];

      if (dataId) {
        this.selected = dataId;
      }
    });

    this.buildBioFields();
  }

  /**
   * Make the bio from user data. The sort functions is useful to show only updated data.
   */
  private buildBioFields(): void {
    const demographics = this.user.demographics;
    if (demographics) {

      // catch the name
      if (demographics.name) {
        this.bioFields.name = demographics.name.value;
      }

      // catch location
      if (demographics.location && demographics.location.length > 0) {
        this.bioFields.location = demographics.location.sort((a, b) => b.timestamp - a.timestamp)[0].value;
      }

      // catch gender
      if (demographics.gender) {
        this.bioFields.gender = demographics.gender.value;
      }

      // catch emails
      if (demographics.email) {
        let emails = '';
        const emailSortedArray = demographics.email.sort((a, b) => b.timestamp - a.timestamp);
        for (const email of emailSortedArray) {

          // only the last emails with the same timestamp
          if (email.timestamp === emailSortedArray[0].timestamp) {
            emails += email.value + ', ';
          }
        }

        // remove last comma
        if (emails.substr(emails.length - 2) === ', ') {
          emails = emails.substr(0, emails.length - 2);
        }
        this.bioFields.email = emails;
      }

      // catch gender
      if (demographics.gender) {
        this.bioFields.gender = demographics.gender.value;
      }

      // catch languages
      if (demographics.language) {
        let languages = '';
        const languageSortedArray = demographics.language.sort((a, b) => b.timestamp - a.timestamp);

        for (const language of languageSortedArray) {

          // only the last languages with the same timestamp and different value
          if (language.timestamp === languageSortedArray[0].timestamp ) {
            languages += language.value + ', ';
          }
        }

        // remove last comma
        if (languages.substr(languages.length - 2) === ', ') {
          languages = languages.substr(0, languages.length - 2);
        }
        this.bioFields.language = languages;
      }

      // catch date of birth
      if (demographics.dateOfBirth) {
        this.bioFields.dateOfBirth = demographics.dateOfBirth.value;
      }

      // TODO add here new fields to collect

    }
  }

}
