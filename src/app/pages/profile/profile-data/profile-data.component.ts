import {Component, OnInit} from '@angular/core';
import {APP_ROUTES} from '../../../app-routes';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {ProfileService} from '../../../services/profile.service';
import {StatsService} from '../../../services/stats.service';
import {FacebookService} from '../../../services/facebook.service';
import {TwitterService} from '../../../services/twitter.service';

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
    industry?: string,
    dateOfBirth?: string,
    height?: string,
    weight?: string,
    country?: string,
    interests?: string,
    sentiment?: string,
    emotion?: string,
    personality?: string,
    empathy?: string,
    socialRelations?: string,

    // TODO add here more fields
  } = { };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private profileService: ProfileService,
    private statsService: StatsService,
    private facebookService: FacebookService,
    private twitterService: TwitterService,
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

      // catch industry
      if (demographics.industry && demographics.industry.length > 0) {
        this.bioFields.industry = demographics.industry.sort((a, b) => b.timestamp - a.timestamp)[0].value;
      }

      // catch interests
      this.statsService.getInterestsStats({limit: 3}).then(
        (res) => {
          if (res && res.length) {
            this.bioFields.interests = res[0].value + ', ' + res[1].value + ' and ' + res[2].value;
          }
        }
      );

      // catch mood (sentiment)
      this.statsService.getSentimentTimelineStats().then(
        (res) => {
            if (res && res.length) {
              const lastData = {date: '0', name: null};

              res.forEach((data) => {
                const tempMessage = data.values[data.values.length - 1];
                if (tempMessage.date > lastData.date) {
                  lastData.name = data.name;
                  lastData.date = tempMessage.date;
                }
              });

              if (lastData.name === 'No sentiment') {
                lastData.name = 'neuter';
              }

              this.bioFields.sentiment = lastData.name;
            }
          }
      );

      // catch emotion
      this.statsService.getEmotionTimelineStats().then(
        (res) => {
          if (res && res.length) {
            const lastData = {date: '0', name: null};

            res.forEach((data) => {
              const tempMessage = data.values[data.values.length - 1];
              if (tempMessage.date > lastData.date) {
                lastData.name = data.name;
                lastData.date = tempMessage.date;
              }
            });

            if (lastData.name) {
              if (lastData.name === 'disgust') {
                lastData.name = 'disgusted';
              } else if (lastData.name === 'anger') {
                lastData.name = 'angry';
              } else if (lastData.name === 'joy') {
                lastData.name = 'joyful';
              } else if (lastData.name === 'fear') {
                lastData.name = 'afraid';
              } else if (lastData.name === 'surprise') {
                lastData.name = 'surprised';
              }

              this.bioFields.emotion = lastData.name;
            }

          }
        }
      );

      // catch personality
      if (this.user.personalities && this.user.personalities.length) {
        this.bioFields.personality = '';
        const last = this.user.personalities.sort((a, b) => b.timestamp - a.timestamp)[0];

        // remove metadata
        last.source = undefined;
        last.confidence = undefined;
        last.timestamp = undefined;

        let i = 0;
        while (i < 2) {
          let maxValue = -1;
          let maxKey = '';
          for (const key in last) {
            if (last.hasOwnProperty(key)) {
              if (last[key] > maxValue) {
                maxValue = last[key];
                maxKey = key;
              }
            }
          }
          last[maxKey] = undefined;

          if (i == 0) {
            this.bioFields.personality += maxKey + ' and ';
          } else {
            this.bioFields.personality += maxKey;
          }

          i++;
        }
      }

      // catch empathy
      if (this.user.empathies && this.user.empathies.length) {
        const empathyValue = this.user.empathies.sort((a, b) => b.timestamp - a.timestamp)[0].value;
        this.bioFields.empathy = 'medium';
        if (empathyValue <= 0.3) {
          this.bioFields.empathy = 'low';
        } else if (empathyValue > 0.7) {
          this.bioFields.empathy = 'high';
        }
      }

      // catch social relations
      this.getFacebookFriends(1000, []).then(
        (res) => {
          this.getTwitterFriends(1000, res).then(
            (res2) => {
              this.getAndroidContacts(1000, res2).then(
                (res3) => {
                  if (res3 && res3.length > 2) {
                    this.bioFields.socialRelations = res3.length + ' social relations. ' +
                      'The persons you interact with the most are ' + res3[0].name + ' and ' + res3[1].name;
                  }
                }
              );
            }
          );
        }
      );

      // TODO add here new fields to collect

    }
  }


  /**
   * Get Facebook friends.
   * @param number: the friends number
   * @param data: input/output array
   */
  private getFacebookFriends(number: number, data?: any[]): Promise<any> {
    return new Promise((resolve, reject) =>
      this.facebookService.friends(number).subscribe(
      (res) => {
        if (res.friends && res.friends.length > 0) {
          res.friends.forEach((friend) => {
            data.push({name: friend.contactName, id: null, interactions: 1});
          });
          data.sort((a, b) => b.interactions - a.interactions);
        }
        return resolve(data);
      },
      (err) => {
        return resolve(data);
      }
    ));
  }

  /**
   * Get Twitter friends (followers and followings)
   * @param number: the friends number
   * @param data: input/output array
   */
  private getTwitterFriends(number: number, data?: any[]): Promise<any> {
    return new Promise((resolve, reject) =>
      this.twitterService.friends(number).subscribe(
      (res) => {
        if (res.friends && res.friends.length > 0) {
          res.friends.forEach((friend) => {
            const contact = data.find(x => x.id == friend.contactId);
            if (contact) {
              contact.interactions++;
            } else {
              data.push({name: friend.contactName, id: friend.contactId, interactions: 1});
            }
          });
          data.sort((a, b) => b.interactions - a.interactions);
        }
        return resolve(data);
      },
      (err) => {
        return resolve(data);
      }
    ));
  }

  /**
   * Get Android contacts.
   * @param number: the contacts number
   * @param data: input/output array
   */
  private getAndroidContacts(number: number, data?: any[]): Promise<any> {
    return new Promise((resolve, reject) =>
      this.statsService.getAndroidContactStats({limitResults: number}).then(
      (res) => {
        if (res.length) {
          res.forEach((contact) => {
            data.push({name: contact.name, id: null, interactions: contact.value});
          });
          data.sort((a, b) => b.interactions - a.interactions);
        }
        return resolve(data);
      },
      (err) => {
        return resolve(data);
      }
    ));
  }

}
