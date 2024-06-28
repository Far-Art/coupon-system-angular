import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {filter} from 'rxjs';


export type Themes = 'dark' | 'light' | 'device';

@Injectable()
export class ThemeService {

  private renderer: Renderer2;

  private currentThemeValue: Themes = 'device';

  private prefersDarkTheme: boolean;

  constructor(rendererFactory: RendererFactory2, private authService: AuthService) {
    this.renderer = rendererFactory.createRenderer(null, null);

    // subscribe to user theme changes
    setTimeout(() => {
      this.authService.user$.pipe(
          filter(user => user.preferredTheme !== this.currentThemeValue)
      ).subscribe(user => {
        this.prefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.setTheme(user.preferredTheme);
      });
    })

    // listen to device mode changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({matches}) => {
      this.prefersDarkTheme = matches;
      if (this.currentThemeValue === 'device') {
        this.setTheme('device');
      }
    });

  }

  get currentTheme() {
    return this.currentThemeValue;
  }

  setTheme(theme: Themes) {
    if (theme == null) {
      theme = this.currentThemeValue;
    } else {
      this.currentThemeValue = theme;
    }

    if (theme === 'dark' || (theme === 'device' && this.prefersDarkTheme)) {
      this.setThemeOnBody('dark')
    } else {
      this.setThemeOnBody('light');
    }
    this.authService.updateUser({user: {preferredTheme: theme}});
    return theme;
  }

  cycle() {
    switch (this.currentThemeValue) {
      case 'light':
        return this.setTheme('dark');
      case 'dark':
        return this.setTheme('device');
      case 'device':
        return this.setTheme('light');
    }
  }

  private setThemeOnBody(theme: Exclude<Themes, 'auto'>) {
    this.renderer.setAttribute(document.body, 'theme', theme);
  }

}
