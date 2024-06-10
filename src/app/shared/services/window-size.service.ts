import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WindowSizeService {

  private _width: number;

  private _height: number;

  private windowSizeSubject = new BehaviorSubject<{ width: number, height: number }>({
    width: window.innerWidth,
    height: window.innerHeight
  });

  get width(): number {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get windowSize$() {
    return this.windowSizeSubject.asObservable();
  }

  constructor() {
    window.addEventListener('resize', () => {
      this._width = window.innerWidth;
      this._height = window.innerHeight;
      this.windowSizeSubject.next({width: this._width, height: this._height});
    })
  }

}
