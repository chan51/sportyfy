import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '@app/shared/models/user.interface';

import { environment } from '@environments/environment';
import { AuthService } from '@app/shared/services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!request.headers.get('nobaseurl')) {
      request = this.rewriteURL(request);
    }
    request = this.addAuthenticationToken(request);

    return next.handle(request);
  }

  private rewriteURL(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({
      url: environment.API_URL + request.url,
    });
  }

  private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
    // add authorization header with jwt token if available
    let currentUser: User = this.authService.getUser();
    if (currentUser && currentUser.ssid) {
      return request.clone({
        setHeaders: {
          ssid: `${currentUser.ssid}`,
        },
      });
    }
    return request;
  }
}
