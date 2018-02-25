import {Component, Input, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-profile-cognitive-aspects',
  styleUrls: ['./../profile-data.component.scss'],
  templateUrl: './profile-data-cognitive-aspects.component.html'
})
export class ProfileDataCognitiveAspectsComponent implements OnInit {


  /**
   * The user profile (logged or not).
   */
  @Input() user: any;

  // data source containing user personality data
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['dataName', 'dataValue'];

  /**
   * @override
   */
  ngOnInit(): void {
    const personalities = this.user.personalities;

    if (personalities && personalities.length) {
      const personalitiesData: {dataName: string, dataValue: any}[] = [];
      const currentPersonality = personalities.sort((a, b) => b.timestamp - a.timestamp)[0];
      personalitiesData.push({dataName: 'openness', dataValue: currentPersonality.openness});
      personalitiesData.push({dataName: 'conscientiousness', dataValue: currentPersonality.conscientiousness});
      personalitiesData.push({dataName: 'extroversion', dataValue: currentPersonality.extroversion});
      personalitiesData.push({dataName: 'agreeableness', dataValue: currentPersonality.agreeableness});
      personalitiesData.push({dataName: 'neuroticism', dataValue: currentPersonality.neuroticism});
      this.dataSource = new MatTableDataSource(personalitiesData);
    }
  }

}
