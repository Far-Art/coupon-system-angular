import {inject} from '@angular/core';
import {ConfirmNavigationService} from './confirm-navigation.service';
import {firstValueFrom} from 'rxjs';
import {Router} from '@angular/router';


export function confirmNavigationGuard(params?: {
  message?: string,
  title?: string,
}): () => Promise<boolean> | boolean {
  return async () => {
    const service = inject(ConfirmNavigationService);
    const router  = inject(Router);

    if (router.getCurrentNavigation()?.extras?.state?.['bypass']) {
      return true;
    }
    return await firstValueFrom(service.showConfirmationDialog(params));
  }
}
