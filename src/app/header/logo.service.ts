import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';


@Injectable({providedIn: 'root'})
export class LogoService {

  private blinkSubject = new BehaviorSubject<void>(undefined);

  get blinked$() {
    return this.blinkSubject.asObservable();
  }

  blink() {
    this.blinkSubject.next();
  }

}