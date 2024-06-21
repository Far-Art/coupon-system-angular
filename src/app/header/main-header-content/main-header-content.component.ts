import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';


@Component({
  selector: 'cs-main-header-content',
  templateUrl: './main-header-content.component.html',
  styleUrls: ['./main-header-content.component.scss'],
  host: {'[id]': '\'MainHeaderContentComponent\''}
})
export class MainHeaderContentComponent implements OnInit, OnDestroy {

  @HostBinding('style.display') style: string = 'none';

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

}
