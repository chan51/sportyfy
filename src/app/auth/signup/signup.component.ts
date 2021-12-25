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

import { LoginComponent } from '@app/auth/login/login.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
})
export class SignupComponent implements OnInit {
  public modalRef!: BsModalRef;

  title: any;
  isOtpSent: boolean = false;
  submitting: boolean = false;
  signupForm: FormGroup = new FormGroup({});

  maskFormNumber = this.maskService.maskForNumber;

  get f(): { [key: string]: AbstractControl } {
    return this.signupForm.controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private authService: AuthService,
    private maskService: MaskService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.pattern(PatternRules.WithoutStartSpace),
        ],
      ],
      email: [
        '',
        [Validators.required, Validators.pattern(PatternRules.Email)],
      ],
      mobile: [
        '',
        [Validators.required, Validators.pattern(PatternRules.PhoneNumber)],
      ],
      otp: [
        null,
        [Validators.required, Validators.pattern(PatternRules.OtpCode)],
      ],
      sid: ['', [Validators.required]],
    });
  }

  generateOTP() {
    const params = {
      phoneNumber: this.signupForm.value.mobile,
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

  public signup() {
    this.submitting = true;
    const { name, email, mobile, otp, sid } = this.signupForm.value;
    const queryParams = {
      name: name,
      mobile: mobile,
      email: email,
      password: otp,
      sid: sid,
    };
    this.authService.signup(queryParams).subscribe(
      (data) => {
        this.submitting = false;
        if (data.id) {
          this.signupForm.reset();
          this.modalService.hide();
          this.toastrService.success('Sign up successfully!');
        } else {
          this.toastrService.error(
            'There is some issue in signing up, try again after some time.'
          );
        }
      },
      ({ error: { data } }) => {
        this.submitting = false;
        this.toastrService.error(
          data
            ? data.message
            : 'There is some issue in signing up, try again after some time.'
        );
      }
    );
  }

  loginModal() {
    this.modalService.hide();
    setTimeout(() => {
      this.modalRef = this.modalService.show(LoginComponent, {
        initialState: {
          title: 'Login',
        },
      });
    }, 150);
  }
}
