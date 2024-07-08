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
    x: 0,
    y: 0,
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
    const subject     = this.scrollPositionSubject;
    let positionY     = 0;
    let prevPositionY = 0;

    function calcScrollDirection(): Direction {
      positionY = Math.round(window.scrollY);
      if (positionY < 5) {
        return 'top';
      } else if (positionY + document.body.clientHeight >= document.body.scrollHeight - 1) {
        return 'bottom';
      }
      return window.scrollY > prevPositionY ? 'down' : 'up'
    }

    return function () {
      if (positionY % 4 === 0) {
        subject.next({
          x: Math.round(window.scrollX),
          y: positionY,
          scrollDirection: calcScrollDirection()
        });
        prevPositionY = positionY;
      }
    }
  }

}
