import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ConfirmNavigationService {

  private confirmSubject = new Subject<boolean>();

  constructor() { }

  params: {
    message?: string,
    title?: string,
  };

  showConfirmationDialog(params?: {
    message?: string,
    title?: string,
  }): Observable<boolean> {
    this.params  = params;
    const toggle = document.getElementById('navigationConfirmToggle') as HTMLButtonElement;
    toggle.click();
    return this.confirmSubject.asObservable();
  }

  confirm(): void {
    this.confirmSubject.next(true);
  }

  decline() {
    this.confirmSubject.next(false);
  }
}
