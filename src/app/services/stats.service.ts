import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AuthService} from './auth.service';

const API_STATS_PERSONAL_DATA_SOURCE = 'api/stats/personal_data/source';

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

}
