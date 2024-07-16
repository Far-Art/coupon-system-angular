import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';


type Direction = 'up' | 'down' | 'top' | 'bottom';

export type Scrollbar = {
  x: number,
  y: number,
  scrollHeight: number,
  scrollDirection: Direction
}

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

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
    scrollHeight: document.body.scrollHeight,
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
      positionY = Math.floor(window.scrollY);
      if (positionY <= 1) {
        return 'top';
      } else if (document.body.scrollHeight - 1 <= positionY + document.body.clientHeight) {
        return 'bottom';
      }
      return positionY > prevPositionY ? 'down' : 'up'
    }

    return function () {
      const posY = Math.floor(window.scrollY);
      subject.next({
        x: Math.floor(window.scrollX),
        y: posY,
        scrollHeight: document.body.scrollHeight,
        scrollDirection: calcScrollDirection()
      });
      prevPositionY = posY;
    }
  }

}
