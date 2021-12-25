import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  AbstractControl,
} from '@angular/forms';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { PatternRules } from '@app/shared/const/pattern-rules.const';

import { AuthService } from '@app/shared/services/auth.service';
import { MaskService } from '@app/shared/services/mask.service';

import { SignupComponent } from '@app/auth/signup/signup.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  public modalRef!: BsModalRef;

  title: any;
  isOtpSent: boolean = false;
  submitting: boolean = false;
  loginForm: FormGroup = new FormGroup({});

  maskFormNumber = this.maskService.maskForNumber;

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private authService: AuthService,
    private maskService: MaskService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      mobile: [
        '',
        [Validators.required, Validators.pattern(PatternRules.PhoneNumber)],
      ],
      otp: [
        '',
        [Validators.required, Validators.pattern(PatternRules.OtpCode)],
      ],
      sid: ['', [Validators.required]],
    });
  }

  generateOTP() {
    const params = {
      phoneNumber: this.loginForm.value.mobile,
    };
    this.isOtpSent = true;
    this.toastrService.success('OTP sent to entered mobile number.');

    this.authService
      .sendOTP(params)
      .pipe(
        tap(() => {
          setTimeout(() => (this.isOtpSent = false), 1000 * 60);
        })
      )
      .subscribe((data) => {
        if (data.status) {
          this.f['sid'].setValue(data.sid);
        }
      });
  }

  login() {
    this.submitting = true;
    const { mobile, otp, sid } = this.loginForm.value;
    const queryParams = {
      loginName: mobile,
      password: otp,
      sid: sid,
    };
    this.authService.login(queryParams).subscribe(
      (data) => {
        this.submitting = false;
        if (data.id) {
          this.loginForm.reset();
          this.modalService.hide();
          this.toastrService.success('Logged In successfully!');
        } else {
          this.toastrService.error(
            'There is some issue in login, try again after some time.'
          );
        }
      },
      ({ error: { data } }) => {
        this.submitting = false;
        this.toastrService.error(
          data
            ? data.message
            : 'There is some issue in login, try again after some time.'
        );
      }
    );
  }

  signUpModal() {
    this.modalService.hide();
    setTimeout(() => {
      this.modalRef = this.modalService.show(SignupComponent, {
        initialState: {
          title: 'Signup',
        },
      });
    }, 150);
  }
}
