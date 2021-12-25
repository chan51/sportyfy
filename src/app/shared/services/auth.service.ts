import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { throwError, Observable, BehaviorSubject } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

import { User } from '@app/shared/models/user.interface';
import { URL_LIST } from '@app/shared/const/api-urls.const';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn: BehaviorSubject<any> = new BehaviorSubject(this.isAuth());

  constructor(private http: HttpClient) {}

  public signup(params: any): Observable<any> {
    return this.http.post(URL_LIST.Auth.SignupUser, params).pipe(
      map((item: any) => item.data),
      tap((user: User) => {
        if (user && user.ssid) {
          localStorage.setItem('auth', JSON.stringify(user));
          this.isLoggedIn.next(true);
        }
      })
    );
  }

  public login(params: any): Observable<any> {
    return this.http.post(URL_LIST.Auth.LoginUser, params).pipe(
      map((item: any) => item.data),
      tap((user: User) => {
        if (user && user.ssid) {
          localStorage.setItem('auth', JSON.stringify(user));
          this.isLoggedIn.next(true);
        }
      })
    );
  }

  public sendOTP(params): Observable<any> {
    return this.http
      .get(URL_LIST.OTP.SendOTP, { params })
      .pipe(map((item: any) => item));
  }

  public checkOTP(params): Observable<any> {
    return this.http.post(URL_LIST.OTP.CheckOtp, params).pipe(
      map((item: any) => item.data),
      tap((user: User) => {
        if (user && user.ssid) {
          localStorage.setItem('auth', JSON.stringify(user));
          this.isLoggedIn.next(true);
        }
      })
    );
  }

  /** function to check if user is authenticated */
  public isAuth(): boolean {
    let currentUser = localStorage.getItem('auth')
      ? JSON.parse(localStorage.getItem('auth') || '{}')
      : null;
    return currentUser && currentUser.ssid;
  }

  /** Get loggedin user details */
  public getUser(): User {
    let currentUser = localStorage.getItem('auth')
      ? JSON.parse(localStorage.getItem('auth') || '{}')
      : {};
    return currentUser.ssid ? currentUser : {};
  }

  public logout(): void {
    if (this.isAuth()) {
      this.http.get(URL_LIST.Auth.LogoutUser).subscribe();
    }
    this.removeSession();
  }

  get username(): string {
    let userInfo = this.getUser();
    return userInfo.name;
  }

  get userid(): string {
    let userInfo = this.getUser();
    return userInfo.id;
  }

  get accessToken(): string {
    const auth = this.getUser();
    return auth.ssid;
  }

  removeSession(): void {
    this.isLoggedIn.next(false);
    localStorage.removeItem('auth');
  }
}
