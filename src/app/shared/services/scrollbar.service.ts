import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ScrollbarService {

  private scrollPositionSubject = new BehaviorSubject<{
    x: number,
    y: number,
    scrollDirection: 'up' | 'down'
  }>({
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
