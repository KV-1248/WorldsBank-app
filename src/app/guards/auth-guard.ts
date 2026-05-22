import { CanActivateFn, Router } from '@angular/router'; 
import { inject } from "@angular/core";

export const authGuard: CanActivateFn = (route, state) => {
   const router = inject(Router);
  const token = localStorage.getItem('wb_token');
  // Implement your authentication logic here
  if (!token) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
