import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { ComponentModule } from '../components/component.module';
import { ServicesModule } from '../services/services.module';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IdentitiesComponent } from './identities/identities.component';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatInputModule, MatListModule,
  MatNativeDateModule, MatProgressSpinnerModule, MatSelectModule, MatSidenavModule, MatSliderModule,
  MatSlideToggleModule, MatTabsModule, MatToolbarModule, MatDialogModule, MatIconModule, MatTableModule
} from '@angular/material';
import { IdentitiesTwitterComponent } from './identities/twitter/identities.twitter.component';
import { IdentitiesFacebookComponent } from './identities/facebook/identities.facebook.component';
import { IdentitiesLinkedinComponent } from './identities/linkedin/identities.linkedin.component';
import { IdentitiesAndroidComponent } from './identities/android/identities.android.component';
import { IdentitiesFitbitComponent } from './identities/fitbit/identities.fitbit.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileDataComponent } from './profile/profile-data/profile-data.component';
import { ProfileStatsComponent } from './profile/profile-stats/profile-stats.component';
import { ProfileSettingsComponent } from './profile/profile-settings/profile-settings.component';
import { ChartModule } from 'angular-highcharts';
import { PrivacyComponent } from './privacy/privacy.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CdkTableModule } from '@angular/cdk/table';
import { ErrorComponent } from './error/error.component';
import { DeveloperComponent } from './developer/developer.component';
import { ClipboardModule } from 'ngx-clipboard';
import { ProfileDataDemographicsComponent } from './profile/profile-data/profile-data-demographics/profile-data-demographics.component';
import { PeopleComponent } from './people/people.component';
import { ProfileDataAffectsComponent } from './profile/profile-data/profile-data-affects/profile-data-affects.component';
import { ProfileDataSocialRelationsComponent } from './profile/profile-data/profile-data-social-relations/profile-data-social-relations.component';
import { ProfileDataBehaviorComponent } from './profile/profile-data/profile-data-behavior/profile-data-behavior.component';
import { ProfileDataPhysicalStateComponent } from './profile/profile-data/profile-data-physical-state/profile-data-physical-state.component';
import { ProfileDataInterestComponent } from './profile/profile-data/profile-data-interests/profile-data-interests.component';
import { ProfileDataCognitiveAspectsComponent } from './profile/profile-data/profile-data-cognitive-aspects/profile-data-cognitive-aspects.component';

@NgModule({
  declarations: [
    HomeComponent,
    ErrorComponent,
    PrivacyComponent,
    IdentitiesComponent,
    IdentitiesTwitterComponent,
    IdentitiesFacebookComponent,
    IdentitiesLinkedinComponent,
    IdentitiesAndroidComponent,
    IdentitiesFitbitComponent,
    ProfileComponent,
    ProfileDataComponent,
    ProfileDataDemographicsComponent,
    ProfileDataAffectsComponent,
    ProfileDataBehaviorComponent,
    ProfileDataPhysicalStateComponent,
    ProfileDataInterestComponent,
    ProfileDataCognitiveAspectsComponent,
    ProfileDataSocialRelationsComponent,
    ProfileStatsComponent,
    ProfileSettingsComponent,
    DeveloperComponent,
    PeopleComponent,
  ],
  imports: [
    ComponentModule,
    AppRoutingModule,
    ServicesModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatToolbarModule,
    MatTabsModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatIconModule,
    MatSliderModule,
    MatTableModule,
    CdkTableModule,
    ChartModule,
    ClipboardModule,
  ],
  providers: [],
})
export class PagesModule {}
