import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';


type Direction = 'up' | 'down' | 'top' | 'bottom';

export type Scrollbar = {
  x: number,
  y: number,
  scrollDirection: Direction
}

@Injectable({
  providedIn: 'root'
})
export class ScrollbarService {

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant'
        } as any);
      }
    });
  }

  private scrollPositionSubject = new BehaviorSubject<Scrollbar>({
    x: window.scrollX,
    y: window.scrollY,
    scrollDirection: 'top'
  });

  scrollPosition$() {
    window.addEventListener('scroll', this.listener());
    return this.scrollPositionSubject.asObservable();
  }

  unsubscribeScroll() {
    window.removeEventListener('scroll', this.listener());
  }

  private listener() {
    const subject = this.scrollPositionSubject;
    let prevPositionY = 0;

    // TODO Element.scrollHeight
    function calcScrollDirection(): Direction {
      if (window.scrollY === 0) {
        return 'top';
      }
      return window.scrollY > prevPositionY ? 'down' : 'up'
    }

    return function () {
      if (window.scrollY % 5 === 0) {
        subject.next({
          x: window.scrollX,
          y: window.scrollY,
          scrollDirection: calcScrollDirection()
        });
        prevPositionY = window.scrollY;
      }
    }
  }

}
