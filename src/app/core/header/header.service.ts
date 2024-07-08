import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private _headerContent = new BehaviorSubject<Node>(null)

  constructor() { }

  set headerContent(headerContent: Node) {
    this._headerContent.next(headerContent);
  }

  get headerContent$() {
    return this._headerContent.asObservable();
  }
}
