import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { IdentitiesComponent } from './pages/identities/identities.component';
import { APP_ROUTES } from './app-routes';
import { IdentitiesTwitterComponent } from './pages/identities/twitter/identities.twitter.component';
import { IdentitiesFacebookComponent } from './pages/identities/facebook/identities.facebook.component';
import { IdentitiesLinkedinComponent } from './pages/identities/linkedin/identities.linkedin.component';
import { IdentitiesAndroidComponent } from './pages/identities/android/identities.android.component';
import { IdentitiesFitbitComponent } from './pages/identities/fitbit/identities.fitbit.component';
import { AuthGuardService } from './services/auth-guard.service';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProfileDataComponent } from './pages/profile/profile-data/profile-data.component';
import { ProfileStatsComponent } from './pages/profile/profile-stats/profile-stats.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { ErrorComponent } from './pages/error/error.component';
import { DeveloperComponent } from './pages/developer/developer.component';
import { ProfileSettingsComponent } from './pages/profile/profile-settings/profile-settings.component';
import { ProfileDataDemographicsComponent } from './pages/profile/profile-data/profile-data-demographics/profile-data-demographics.component';
import { PeopleComponent } from './pages/people/people.component';
import { ProfileDataAffectsComponent } from './pages/profile/profile-data/profile-data-affects/profile-data-affects.component';
import { ProfileDataInterestComponent } from './pages/profile/profile-data/profile-data-interests/profile-data-interests.component';
import { ProfileDataCognitiveAspectsComponent } from './pages/profile/profile-data/profile-data-cognitive-aspects/profile-data-cognitive-aspects.component';
import { ProfileDataPhysicalStateComponent } from './pages/profile/profile-data/profile-data-physical-state/profile-data-physical-state.component';
import { ProfileDataBehaviorComponent } from './pages/profile/profile-data/profile-data-behavior/profile-data-behavior.component';
import { ProfileDataSocialRelationsComponent } from './pages/profile/profile-data/profile-data-social-relations/profile-data-social-relations.component';

const routes: Routes = [
  {
    path: APP_ROUTES.home,
    component: HomeComponent
  },
  {
    path: APP_ROUTES.error,
    component: ErrorComponent
  },
  {
    path: APP_ROUTES.identities.root,
    canActivate: [AuthGuardService],
    component: IdentitiesComponent,
    children: [{
      path: APP_ROUTES.identities.twitter,
      component: IdentitiesTwitterComponent,
    }, {
      path: APP_ROUTES.identities.facebook,
      component: IdentitiesFacebookComponent,
    }, {
      path: APP_ROUTES.identities.linkedin,
      component: IdentitiesLinkedinComponent,
    }, {
      path: APP_ROUTES.identities.android,
      component: IdentitiesAndroidComponent,
    }, {
      path: APP_ROUTES.identities.fitbit,
      component: IdentitiesFitbitComponent,
    },
    ]
  },
  {
    path: APP_ROUTES.profile.root + '/:username',
    canActivate: [AuthGuardService],
    component: ProfileComponent,
    children: [{
      path: APP_ROUTES.profile.data,
      component: ProfileDataComponent,
      children: [{
        path: APP_ROUTES.profile.demographics,
        component: ProfileDataDemographicsComponent,
      }, {
        path: APP_ROUTES.profile.affects,
        component: ProfileDataAffectsComponent,
      }, {
        path: APP_ROUTES.profile.interest,
        component: ProfileDataInterestComponent,
      }, {
        path: APP_ROUTES.profile.cognitiveAspects,
        component: ProfileDataCognitiveAspectsComponent,
      }, {
        path: APP_ROUTES.profile.physicalState,
        component: ProfileDataPhysicalStateComponent,
      }, {
        path: APP_ROUTES.profile.behavior,
        component: ProfileDataBehaviorComponent,
      }, {
        path: APP_ROUTES.profile.socialRelations,
        component: ProfileDataSocialRelationsComponent,
      }]
    }, {
      path: APP_ROUTES.profile.stats,
      component: ProfileStatsComponent,
    }, {
      path: APP_ROUTES.profile.settings,
      component: ProfileSettingsComponent,
    }]
  },
  {
    path: APP_ROUTES.people,
    canActivate: [AuthGuardService],
    component: PeopleComponent,
  },
  {
    path: APP_ROUTES.privacy,
    component: PrivacyComponent,
  },
  {
    path: APP_ROUTES.developer,
    component: DeveloperComponent,
  },

  // leave this path to the end
  {
    path: '**',
    redirectTo: APP_ROUTES.home
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

