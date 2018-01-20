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
      path: APP_ROUTES.profile.general,
      component: ProfileDataComponent,
    }, {
      path: APP_ROUTES.profile.stats,
      component: ProfileStatsComponent,
    }]
  },
  {
    path: APP_ROUTES.privacy,
    component: PrivacyComponent,
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

