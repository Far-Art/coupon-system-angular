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
export class ScrollService {

  private scrollPositionSubject = new BehaviorSubject<Scrollbar>({
    x: window.scrollX,
    y: window.scrollY,
    scrollDirection: 'top'
  });

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

  scrollPosition$(offset: number = 0) {
    window.addEventListener('scroll', this.listener(offset));
    return this.scrollPositionSubject.asObservable();
  }

  private listener(offset: number) {
    const subject     = this.scrollPositionSubject;
    let prevPositionY = 0;

    function calcScrollDirection(): Direction {
      if (window.scrollY === 0) {
        return 'top';
      } else if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
        return 'bottom';
      }
      return window.scrollY > prevPositionY ? 'down' : 'up'
    }

    return function () {
      if (window.scrollY % 5 === 0) {
        if ((window.scrollY > prevPositionY + offset) || (window.scrollY < prevPositionY - offset)) {
          subject.next({
            x: Math.floor(window.scrollX),
            y: Math.floor(window.scrollY),
            scrollDirection: calcScrollDirection()
          });
        }
        prevPositionY = Math.floor(window.scrollY);
      }
    }
  }

}
