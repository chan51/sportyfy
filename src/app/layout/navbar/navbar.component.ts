import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ToastrService } from 'ngx-toastr';

import { AuthService } from '@app/shared/services/auth.service';

import { LoginComponent } from '@app/auth/login/login.component';
import { SignupComponent } from '@app/auth/signup/signup.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  public modalRef!: BsModalRef;
  public username: string = '';

  constructor(
    private modalService: BsModalService,
    private router: Router,
    private authService: AuthService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.router.navigate(['/']);
    this.authService.isLoggedIn.subscribe((isLoggedIn) => {
      this.username = isLoggedIn ? this.authService.username : '';
    });
  }

  marketplace() {
    this.router.navigate([], { fragment: 'marketplace' });
    //this.scroller.scrollToAnchor("marketplace");
  }

  aboutus() {
    this.router.navigate([], { fragment: 'aboutus' });
    // this.scroller.scrollToAnchor("aboutus");
  }

  token() {
    this.router.navigate([], { fragment: 'token' });
  }

  roadmap() {
    this.router.navigate([], { fragment: 'roadmap' });
  }

  loginModal() {
    this.modalRef = this.modalService.show(LoginComponent, {
      initialState: {
        title: 'Login',
      },
    });
  }

  signUpModal() {
    this.modalRef = this.modalService.show(SignupComponent, {
      initialState: {
        title: 'Signup',
      },
    });
  }

  logoutUser() {
    this.authService.logout();
    this.toastrService.success('Logged out successfully!');
  }
}
