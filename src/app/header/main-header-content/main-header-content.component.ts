import {Component, HostBinding, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {HeaderService} from '../header.service';


@Component({
  selector: 'cs-main-header-content',
  templateUrl: './main-header-content.component.html',
  styleUrls: ['./main-header-content.component.scss'],
  host: {'[id]': '\'MainHeaderContentComponent\''}
})
export class MainHeaderContentComponent implements OnInit, OnDestroy {

  @HostBinding('style.display') style: string = 'none';

  @ViewChild('mainHeaderContentContainer', {static: true, read: ViewContainerRef}) headerContent: ViewContainerRef;

  constructor(private service: HeaderService) {}

  ngOnInit(): void {
    this.service.headerContent = (this.headerContent.element.nativeElement as HTMLElement).previousSibling;
  }

  ngOnDestroy(): void {
    this.service.headerContent = null;
  }

}
