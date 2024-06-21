import {Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {filter, Subscription} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {ScrollbarService} from '../shared/services/scrollbar.service';
import {UserData} from '../shared/models/user-data.model';
import {NavigationEnd, Router} from '@angular/router';


@Component({
  selector: 'cs-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Input('showLogoTitle') isShowLogoTitle = false;

  @ViewChild('mainHeaderContentRef') headerContentRef: ElementRef;

  constructor(
      private authService: AuthService,
      private scrollService: ScrollbarService,
      private renderer: Renderer2,
      private router: Router
  ) {}

  userName: string;
  user: UserData;
  padding: string;

  private paddingNarrow = 'pt-1 pb-1';
  private paddingWide   = 'pt-4 pb-4';

  private authSub: Subscription;

  ngOnInit(): void {
    this.padding = this.paddingWide;

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

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.updateHeaderContent();
    })
  }

  private updateHeaderContent() {
    setTimeout(() => {
      // const child                      = headerContent.children.item(0);
      // if (headerContent.children.length > 0) {
      // this.content = headerContent.removeChild(child);
      // this.renderer.removeChild(headerContent, child, true)
      // }
      const headerContent: HTMLElement = this.headerContentRef.nativeElement;
      if (headerContent.children.item(0)) {
        this.renderer.setStyle(headerContent.children.item(0), 'display', 'none');
        // headerContent.removeChild(headerContent.children.item(0))
      }
      const el = document.getElementById('MainHeaderContentComponent');
      if (el) {
        this.renderer.removeStyle(el, 'display');
        this.renderer.setAttribute(el, 'cs-main-header-content', '');
        this.renderer.setStyle(el, 'display', 'block');
        this.renderer.appendChild(headerContent, el)
      }
    }, 0);
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

}
