import {Component, OnInit} from '@angular/core';
import {LinkedinService} from '../../../services/linkedin.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {AuthService} from '../../../services/auth.service';
import {ConfirmDialogComponent} from '../../../components/confirm-dialog/confirm-dialog.component';
import {environment} from '../../../../environments/environment';

@Component({
  styleUrls: ['./identities.linkedin.component.scss'],
  templateUrl: './identities.linkedin.component.html',
})
export class IdentitiesLinkedinComponent implements OnInit {

  /**
   * Current logged user.
   */
  user: any;

  /**
   * True if something is loading.
   */
  loading = true;

  // data source containing user LinkedIn profile data
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['dataName', 'dataValue'];

  private authorizationCode: string;

  constructor(
    private linkedinService: LinkedinService,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private dialog: MatDialog,
  ) {}

  /**
   * @override
   */
  ngOnInit(): void {
    this.authService.getUser().then((user) => {
      if (user && user.identities && user.identities.linkedIn) {
        this.loading = false;
        this.user = user;
        this.setupLinkedinProfileTable();

        // clean the URL
        window.history.replaceState(null, null, window.location.pathname);

      } else {

        // reading parameters returned by LinkedIn
        this.route.queryParams.subscribe(params => {
          this.authorizationCode = params['code'];

          if (this.authorizationCode) {

            // clean the URL
            window.history.replaceState(null, null, window.location.pathname);

            // request access token
            this.linkedinService.accessToken(this.authorizationCode).subscribe((res) => {

              // update user profile
              this.updateProfile();

            });
          } else {
            this.loading = false;
          }
        });
      }
    });
  }

  /**
   * Associate user account with LinkedIn.
   */
  associate() {
    this.linkedinService.getLoginDialog().subscribe(
      (res) => {
        window.location.href = res.loginDialogUrl;
      },
      (err) => {
        if (!isNullOrUndefined(err.error.message)) {
          this.toast.error(err.error.message);
        } else {
          this.toast.error('Server error occurred. Try again later.');
        }
      });
  }

  /**
   * Update user LinkedIn profile information.
   * @param showToast: if you want to show the toast messages
   */
  updateProfile(showToast?: boolean) {
    this.linkedinService.userProfile().subscribe((res) => {
      this.loading = false;
      if (res && res.user) {
        if (showToast) {
          this.toast.success('Profile Updated');
        }
        this.user = res.user;
        this.setupLinkedinProfileTable();
      } else {
        if (showToast) {
          this.toast.warning('Timeout not elapsed. Retry in about five minutes');
        }
      }
    });
  }

  /**
   * Delete LinkedIn information account.
   */
  deleteAccount() {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        infoText: 'Are you sure? All data related to your LinkedIn account will be deleted from ' + environment.appName
      }
    });

    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.linkedinService.deleteAccount().subscribe((res) => {
          if (res.auth) {
            this.user.identities.linkedIn = null;
          } else {
            this.toast.error('Something went wrong.');
          }
        });
      }
    });
  }

  /**
   * Populate the dataSource object reading the element from user LinkedIn profile.
   */
  private setupLinkedinProfileTable() {

    // user LinkedIn data
    const linkedIn = this.user.identities.linkedIn;

    // array used to populate the data source object
    const linkedInProfile: {dataName: string, dataValue: any}[] = [];

    for (const dataName in linkedIn) {
      if (linkedIn.hasOwnProperty(dataName)) {
        if (linkedIn[dataName] instanceof Object) {
          linkedInProfile.push({dataName: dataName, dataValue: JSON.stringify(linkedIn[dataName], null, 2)});
        } else {
          linkedInProfile.push({dataName: dataName, dataValue: linkedIn[dataName]});
        }
      }
    }
    this.dataSource = new MatTableDataSource(linkedInProfile);
  }

}
