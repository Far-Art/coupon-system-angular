import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from './auth.service';
import {firstValueFrom} from 'rxjs';


export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router      = inject(Router);

  const user = await firstValueFrom(authService.user$);

  if (user != null) {
    router.navigate(['/account']);
    return false;
  }
  return true;
};

