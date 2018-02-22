import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AuthService} from './auth.service';
import {isNullOrUndefined} from 'util';

const API_STATS_PERSONAL_DATA_SOURCE = 'api/stats/personal_data/source';
const API_STATS_INTERESTS_WORD_CLOUD = 'api/stats/interests/wordcloud';

@Injectable()
export class StatsService {

  private url: string;
  private username: string;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {
    this.url = environment.api;
    this.username = this.authService.getUserame();
  }

  /**
   * Get personal data source stats.
   * @return: stats object as [{name: string, value: number}]
   */
  getPersonalDataSourceStats(): Promise<any> {
    const params = `?db=${this.username}`;
    return this.http.get(`${this.url}${API_STATS_PERSONAL_DATA_SOURCE}${params}`).toPromise();
  }

  /**
   * Get interests data stats.
   * @return: stats object as [{value: string, weight: number}]
   */
  getInterestsStats(filter?: {dateFrom?: Date, dateTo?: Date, source?: string}): Promise<any> {
    let params = `?db=${this.username}&`;

    if (!isNullOrUndefined(filter)) {
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

}
