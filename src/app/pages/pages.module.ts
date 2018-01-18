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
import { ChartModule } from 'angular-highcharts';
import { PrivacyComponent } from './privacy/privacy.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CdkTableModule } from '@angular/cdk/table';

@NgModule({
  declarations: [
    HomeComponent,
    PrivacyComponent,
    IdentitiesComponent,
    IdentitiesTwitterComponent,
    IdentitiesFacebookComponent,
    IdentitiesLinkedinComponent,
    IdentitiesAndroidComponent,
    IdentitiesFitbitComponent,
    ProfileComponent,
    ProfileDataComponent,
    ProfileStatsComponent,
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
  ],
  providers: [],
})
export class PagesModule {}
