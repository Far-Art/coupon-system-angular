import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {firstValueFrom} from 'rxjs';
import {AuthService} from '../../auth/auth.service';


export const accountGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router      = inject(Router);

  const user = await firstValueFrom(authService.user$);

  if (user == null || user.type === 'guest') {
    await router.navigate(['/auth/login']);
    return false;
  }
  return true;
};

