import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AuthService} from './auth.service';
import {isNullOrUndefined} from 'util';

const GlOBAL_DATABASE = 'globalData';

const API_STATS_PERSONAL_DATA_SOURCE = 'api/stats/personal_data/source';
const API_STATS_INTERESTS_WORD_CLOUD = 'api/stats/interests/wordcloud';
const API_STATS_CONTACT_ANDROID = 'api/stats/personal_data/contact/bar';
const API_STATS_SENTIMENT_TIMELINE = 'api/stats/sentiment/timeline';
const API_STATS_EMOTION_TIMELINE = 'api/stats/emotion/timeline';
const API_STATS_PERSONA_DATA_GPS = 'api/stats/personal_data/gps';
const API_STATS_PERSONA_DATA_NETSTATS_BAR = 'api/stats/personal_data/netstat/bar';
const API_STATS_PERSONA_DATA_NETSTATS_TIMELINE = 'api/stats/personal_data/netstat/timeline';
const API_STATS_PERSONA_DATA_APPINFO_TIMELINE = 'api/stats/personal_data/appinfo/timeline';
const API_STATS_PERSONA_DATA_APPINFO_BAR = 'api/stats/personal_data/appinfo/bar';
const API_STATS_PERSONA_DATA_DISPLAY_BAR = 'api/stats/personal_data/display/bar';

@Injectable()
export class StatsService {

  private url: string;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {
    this.url = environment.api;
  }

  /**
   * Get personal data source stats.
   * @return: stats object as [{name: string, value: number}]
   */
  getPersonalDataSourceStats(): Promise<any> {
    const params = `?db=${this.authService.getUserame()}`;
    return this.http.get(`${this.url}${API_STATS_PERSONAL_DATA_SOURCE}${params}`).toPromise();
  }

  /**
   * Get interests data stats.
   * @param filter: the filters
   * @return: stats object as [{value: string, weight: number}]
   */
  getInterestsStats(filter?: {dateFrom?: Date, dateTo?: Date, source?: string, global?: boolean}): Promise<any> {
    let params = `?db=${this.authService.getUserame()}&`;

    if (!isNullOrUndefined(filter)) {
      if (!isNullOrUndefined(filter.global) && filter.global) {
        params = `?db=${GlOBAL_DATABASE}&`;
      }
      if (!isNullOrUndefined(filter.dateFrom)) {
        params += 'from=' + filter.dateFrom + '&';
      }
      if (!isNullOrUndefined(filter.dateTo)) {
        params += 'to=' + filter.dateTo + '&';
      }
      if (!isNullOrUndefined(filter.source)) {
        params += 'source=' + filter.source + '&';
      }
    }

    return this.http.get(`${this.url}${API_STATS_INTERESTS_WORD_CLOUD}${params}`).toPromise();
  }

  /**
   * Get Android contacts.
   * @param filter: the filters
   * @return: contacts stats object as [{name: string, value: number}]
   */
  getAndroidContactStats(filter?: {limitResults?: number}): Promise<any> {
    let params = `?db=${this.authService.getUserame()}&`;

    if (!isNullOrUndefined(filter)) {
      if (!isNullOrUndefined(filter.limitResults)) {
        params += 'limitResults=' + filter.limitResults + '&';
      }
    }

    return this.http.get(`${this.url}${API_STATS_CONTACT_ANDROID}${params}`).toPromise();
  }

  /**
   * Get sentiment timeline.
   * @param filter: the filters
   * @return: timeline stats object as [{values: [{date: Date, value: number}], name: string}]
   */
  getSentimentTimelineStats(filter?: {dateFrom?: Date, dateTo?: Date, global?: boolean}): Promise<any> {
    let params = `?db=${this.authService.getUserame()}&`;

    if (!isNullOrUndefined(filter)) {
      if (!isNullOrUndefined(filter.global) && filter.global) {
        params = `?db=${GlOBAL_DATABASE}&`;
        params += `type=${GlOBAL_DATABASE}&`;
      }
      if (!isNullOrUndefined(filter.dateFrom)) {
        params += 'from=' + filter.dateFrom + '&';
      }
      if (!isNullOrUndefined(filter.dateTo)) {
        params += 'to=' + filter.dateTo + '&';
      }
    }

    return this.http.get(`${this.url}${API_STATS_SENTIMENT_TIMELINE}${params}`).toPromise();
  }

  /**
   * Get emotion timeline.
   * @param filter: the filters
   * @return: timeline stats object as [{values: [{date: Date, value: number}], name: string}]
   */
  getEmotionTimelineStats(filter?: {dateFrom?: Date, dateTo?: Date, global?: boolean}): Promise<any> {
    let params = `?db=${this.authService.getUserame()}&`;

    if (!isNullOrUndefined(filter)) {
      if (!isNullOrUndefined(filter.global) && filter.global) {
        params = `?db=${GlOBAL_DATABASE}&`;
        params += `type=${GlOBAL_DATABASE}&`;
      }
      if (!isNullOrUndefined(filter.dateFrom)) {
        params += 'from=' + filter.dateFrom + '&';
      }
      if (!isNullOrUndefined(filter.dateTo)) {
        params += 'to=' + filter.dateTo + '&';
      }
    }

    return this.http.get(`${this.url}${API_STATS_EMOTION_TIMELINE}${params}`).toPromise();
  }


  /**
   * Get user GPS positions.
   * @param filter: the filters
   * @return use GPS positions as [{latitude: number, longitude: number}]
   */
  getGPSMapStats(filter?: {dateFrom?: Date, dateTo?: Date, latitude?: number,
      longitude?: number, radius?: number}): Promise<any> {

    let params = `?db=${this.authService.getUserame()}&`;

    if (!isNullOrUndefined(filter)) {
      if (!isNullOrUndefined(filter.dateFrom)) {
        params += 'from=' + filter.dateFrom + '&';
      }
      if (!isNullOrUndefined(filter.dateTo)) {
        params += 'to=' + filter.dateTo + '&';
      }
      if (!isNullOrUndefined(filter.latitude)) {
        params += 'lat=' + filter.latitude + '&';
      }
      if (!isNullOrUndefined(filter.longitude)) {
        params += 'lng=' + filter.longitude + '&';
      }
      if (!isNullOrUndefined(filter.radius)) {
        params += 'ray=' + filter.radius + '&';
      }
    }

    return this.http.get(`${this.url}${API_STATS_PERSONA_DATA_GPS}${params}`).toPromise();
  }

  /**
   * Get network statistics data for a bar chart visualization.
   * @param filter: the filters
   * @return use netstats data as [{networkType: string, totalRxBytes: number, totalTxBytes: number}]
   */
  getNetStatsBarStats(filter?: {dateFrom?: Date, dateTo?: Date}): Promise<any> {
    let params = `?db=${this.authService.getUserame()}&`;

    if (!isNullOrUndefined(filter)) {
      if (!isNullOrUndefined(filter.dateFrom)) {
        params += 'from=' + filter.dateFrom + '&';
      }
      if (!isNullOrUndefined(filter.dateTo)) {
        params += 'to=' + filter.dateTo + '&';
      }
    }

    return this.http.get(`${this.url}${API_STATS_PERSONA_DATA_NETSTATS_BAR}${params}`).toPromise();
  }

  /**
   * Get network statistics data for a timeline chart visualization.
   * @param filter: the filters
   * @return use netstats data as [{networkType: string, values: [{date: number, totalRxBytes: number, totalTxBytes: number}]}]
   */
  getNetStatsTimelineStats(filter?: {dateFrom?: Date, dateTo?: Date}):  Promise<any> {
    let params = `?db=${this.authService.getUserame()}&`;

    if (!isNullOrUndefined(filter)) {
      if (!isNullOrUndefined(filter.dateFrom)) {
        params += 'from=' + filter.dateFrom + '&';
      }
      if (!isNullOrUndefined(filter.dateTo)) {
        params += 'to=' + filter.dateTo + '&';
      }
    }

    return this.http.get(`${this.url}${API_STATS_PERSONA_DATA_NETSTATS_TIMELINE}${params}`).toPromise();
  }


  /**
   * Get apps statistics data for a timeline chart visualization.
   * @param filter: the filters
   * @return use appinfo data as [{name: string, values: [{date: number, totalForegroundTime: number}]}]
   */
  getAppInfoTimelineStats(filter?: {dateFrom?: Date, dateTo?: Date}):  Promise<any> {
    let params = `?db=${this.authService.getUserame()}&`;

    if (!isNullOrUndefined(filter)) {
      if (!isNullOrUndefined(filter.dateFrom)) {
        params += 'from=' + filter.dateFrom + '&';
      }
      if (!isNullOrUndefined(filter.dateTo)) {
        params += 'to=' + filter.dateTo + '&';
      }
    }

    return this.http.get(`${this.url}${API_STATS_PERSONA_DATA_APPINFO_TIMELINE}${params}`).toPromise();
  }

  /**
   * Get apps statistics data for a bar chart visualization.
   * @param filter: the filters
   * @return use appinfo data as [{name: string, value: number}]
   */
  getAppInfoBarStats(filter?: {dateFrom?: Date, dateTo?: Date, groupByCategory?: boolean}):  Promise<any> {
    let params = `?db=${this.authService.getUserame()}&`;

    if (!isNullOrUndefined(filter)) {
      if (!isNullOrUndefined(filter.dateFrom)) {
        params += 'from=' + filter.dateFrom + '&';
      }
      if (!isNullOrUndefined(filter.dateTo)) {
        params += 'to=' + filter.dateTo + '&';
      }
      if (!isNullOrUndefined(filter.groupByCategory)) {
        params += 'groupByCategory=' + filter.groupByCategory + '&';
      }
    }

    return this.http.get(`${this.url}${API_STATS_PERSONA_DATA_APPINFO_BAR}${params}`).toPromise();
  }

  /**
   * Get display statistics data for a bar chart visualization.
   * @param filter: the filters
   * @return use display data as [{name: string, value: number}]
   */
  getDisplayBarStats(filter?: {dateFrom?: Date, dateTo?: Date}):  Promise<any> {
    let params = `?db=${this.authService.getUserame()}&`;

    if (!isNullOrUndefined(filter)) {
      if (!isNullOrUndefined(filter.dateFrom)) {
        params += 'from=' + filter.dateFrom + '&';
      }
      if (!isNullOrUndefined(filter.dateTo)) {
        params += 'to=' + filter.dateTo + '&';
      }
    }

    return this.http.get(`${this.url}${API_STATS_PERSONA_DATA_DISPLAY_BAR}${params}`).toPromise();
  }
}
