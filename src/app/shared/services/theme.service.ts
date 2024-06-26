import {Injectable, Renderer2, RendererFactory2} from '@angular/core';


export type Themes = 'dark' | 'light' | 'system';

@Injectable()
export class ThemeService {

  private renderer: Renderer2;

  private currentThemeValue: Themes = 'system';

  private prefersDarkTheme: boolean;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer         = rendererFactory.createRenderer(null, null);
    this.prefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.setTheme('system');

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({matches}) => {
      if (this.currentThemeValue === 'system') {
        this.prefersDarkTheme = matches;
        this.setTheme('system');
      }
    });
  }

  get currentTheme() {
    return this.currentThemeValue;
  }

  setTheme(theme: Themes) {
    if (theme === 'dark' || (theme === 'system' && this.prefersDarkTheme)) {
      this.setThemeOnBody('dark')
    } else {
      this.setThemeOnBody('light');
    }
    this.currentThemeValue = theme;
    return theme;
  }

  cycle() {
    switch (this.currentThemeValue) {
      case 'light':
        return this.setTheme('dark');
      case 'dark':
        return this.setTheme('system');
      case 'system':
        return this.setTheme('light');
    }
  }

  private setThemeOnBody(theme: Exclude<Themes, 'auto'>) {
    this.renderer.setAttribute(document.body, 'theme', theme);
  }

}
