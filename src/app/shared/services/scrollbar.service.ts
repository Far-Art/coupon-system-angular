import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ScrollbarService {

  private scrollPositionSubject = new BehaviorSubject<{
    x: number,
    y: number, scrollbar: {
      lenX: number,
      lenY: number
    }
  }>({
    x: 0,
    y: 0,
    scrollbar: {
      lenX: 0,
      lenY: 0
    }
  });

  scrollPosition$() {
    window.addEventListener('scroll', this.listener());
    return this.scrollPositionSubject.asObservable();
  }

  unsubscribeScroll() {
    window.removeEventListener('scroll', this.listener());
  }

  private listener() {
    const pos = this.scrollPositionSubject;
    return function () {
      pos.next({
        x: window.scrollX, y: window.scrollY, scrollbar: {
          lenX: window.innerWidth - document.documentElement.clientWidth,
          lenY: window.innerHeight - document.documentElement.clientHeight
        }
      });
    }
  }

}
