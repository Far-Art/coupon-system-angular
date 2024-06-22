import {Component, Input, OnDestroy, OnInit, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {ScrollbarService} from '../shared/services/scrollbar.service';
import {UserData} from '../shared/models/user-data.model';
import {HeaderService} from './header.service';


@Component({
  selector: 'cs-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Input('showLogoTitle') isShowLogoTitle = false;

  @ViewChild('headerContentContainer', {static: true, read: ViewContainerRef}) headerContent: ViewContainerRef;

  private parentNode: Node;
  private contentNode: Node;

  userName: string;
  user: UserData;
  padding: string;

  private paddingNarrow = 'pt-1 pb-1';
  private paddingWide   = 'pt-4 pb-4';

  private authSub: Subscription;

  constructor(
      private authService: AuthService,
      private scrollService: ScrollbarService,
      private renderer: Renderer2,
      private headerService: HeaderService
  ) {}

  ngOnInit(): void {
    this.parentNode = (this.headerContent.element.nativeElement as HTMLElement).previousSibling;
    this.padding    = this.paddingWide;

    this.authSub = this.authService.user$.subscribe(user => {
      this.user     = user;
      this.userName = this.userName = user != null && user.name != null ? user.name : 'Guest';
    });

    this.scrollService.scrollPosition$().subscribe(s => {
      if (s.y > 120 && s.scrollDirection === 'down') {
        this.padding = this.paddingNarrow;
      } else {
        this.padding = this.paddingWide;
      }
    });

    this.headerService.headerContent$.subscribe(node => {
      if (node) {
        this.contentNode = node;
        this.renderer.appendChild(this.parentNode, this.contentNode);
      } else if (this.contentNode) {
        this.renderer.removeChild(this.parentNode, this.contentNode);
        this.contentNode = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

}
