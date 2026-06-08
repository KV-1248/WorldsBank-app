import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from './auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const publicRoutes = ['/auth/register', '/auth/login', '/auth/verify-otp', '/auth/verify-login-otp', '/auth/resend-otp'];
  const isPublic = publicRoutes.some(route => req.url.includes(route));

  if (isPublic) {
    return next(req);
  }

  const auth = inject(Auth);
  const token = auth.getToken();

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }

  return next(req);
};