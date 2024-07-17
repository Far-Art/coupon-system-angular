import {Component, Input, OnDestroy, OnInit, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import {UserData} from '../../shared/models/user-data.model';
import {HeaderService} from './header.service';
import {Themes, ThemeService} from '../../shared/services/theme.service';
import {ScrollService} from '../../shared/services/scroll.service';


@Component({
  selector: 'cs-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Input('showLogoTitle') isShowLogoTitle: boolean = false;

  @ViewChild('headerContentContainer', {
    static: true,
    read: ViewContainerRef
  }) headerContent: ViewContainerRef;

  userName: string;
  user: Partial<UserData>;
  padding: string;
  theme: Themes;

  private parentNode: Node;
  private contentNode: Node;
  private paddingNarrow = 'pt-2 pb-2';
  private paddingWide   = 'pt-4 pb-4';
  private prevDirection: string;

  private authSub: Subscription;

  constructor(
      private authService: AuthService,
      private scrollService: ScrollService,
      private renderer: Renderer2,
      private headerService: HeaderService,
      private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.parentNode = (this.headerContent.element.nativeElement as HTMLElement).previousSibling;
    this.padding    = this.paddingWide;

    this.authSub = this.authService.user$.subscribe(user => {
      this.user     = user;
      this.userName = this.userName = user.name || 'Guest';
      this.theme    = this.themeService.currentTheme;
    });

    this.scrollService.scrollPosition$().subscribe(s => {
      if (s.y > 120 && this.prevDirection !== s.scrollDirection) {
        this.prevDirection = s.scrollDirection;
        if (s.scrollDirection === 'down' || s.scrollDirection === 'bottom') {
          this.padding = this.paddingNarrow;
        } else {
          this.padding = this.paddingWide;
        }
      }
    });

    this.headerService.headerContent$.subscribe(node => {
      this.isShowLogoTitle = !node;
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

  onThemeCycle(theme?: Themes) {
    if (theme) {
      this.theme = this.themeService.setTheme(theme);
    } else {
      this.theme = this.themeService.cycle();
    }
  }

}
