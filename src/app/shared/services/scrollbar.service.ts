import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';


export type Scrollbar = {
  x: number,
  y: number,
  scrollDirection: 'up' | 'down'
}

@Injectable({
  providedIn: 'root'
})
export class ScrollbarService {

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo({top: 0, left: 0, behavior: 'instant'} as any);
      }
    });
  }

  private scrollPositionSubject = new BehaviorSubject<Scrollbar>({
    x: 0,
    y: 0,
    scrollDirection: 'down'
  });

  scrollPosition$() {
    window.addEventListener('scroll', this.listener());
    return this.scrollPositionSubject.asObservable();
  }

  unsubscribeScroll() {
    window.removeEventListener('scroll', this.listener());
  }

  private listener() {
    const subject     = this.scrollPositionSubject;
    let prevPositionY = 0;

    return function () {
      if (window.scrollY % 5 === 0) {
        subject.next({
          x: window.scrollX,
          y: window.scrollY,
          scrollDirection: window.scrollY > prevPositionY ? 'down' : 'up'
        });
        prevPositionY = window.scrollY;
      }

    }
  }
}
