import {Component, OnInit} from '@angular/core';
import {LinkedinService} from '../../../services/linkedin.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {isNullOrUndefined} from 'util';

@Component({
  templateUrl: './identities.linkedin.component.html',
})
export class IdentitiesLinkedinComponent implements OnInit {

  private authorizationCode: string;

  constructor(
    private linkedinService: LinkedinService,
    private toast: ToastrService,
    private route: ActivatedRoute,
  ) {}

  /**
   * @override
   */
  ngOnInit(): void {

    // reading parameters returned by Facebook
    this.route.queryParams.subscribe(params => {
      this.authorizationCode = params['code'];

      if (this.authorizationCode) {

        // request access token

        this.linkedinService.accessToken(this.authorizationCode).subscribe((res) => {

          // clean the URL
          window.history.replaceState(null, null, window.location.pathname);

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

}
