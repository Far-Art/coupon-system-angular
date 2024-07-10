import {Component, HostBinding, Input, OnChanges} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';


@Component({
  selector: 'cs-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  animations: [
    trigger('showSpinner', [
      state('true', style({
        width: '20px',
        height: '20px',
        opacity: 1
      })),
      state('false', style({
        width: 0,
        height: '20px',
        opacity: 0
      })),
      transition('false <=> true', animate(`${400}ms ease-in-out`))
    ])
  ]
})
export class SpinnerComponent implements OnChanges {
  @Input('class') class                   = '';
  @Input('id') id: number | string | null = null;
  @Input() show                           = false;
  protected _show                         = false;

  @HostBinding('@showSpinner') animation: boolean;
  @HostBinding('class') hostClass: string   = 'overflow-hidden p-0';
  @HostBinding('style.right') right: number = -20;

  ngOnChanges(): void {
    this.animation = this.show;
    if (!this.show) {
      setTimeout(() => {
        this._show = this.show;
      }, 400);
    } else {
      this._show = this.show;
    }

  }

}
