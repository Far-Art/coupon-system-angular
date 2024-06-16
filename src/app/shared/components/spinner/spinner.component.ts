import {Component, HostBinding, Input} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';


@Component({
  selector: 'cs-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  // TODO make smooth appear animation
  animations: [
    trigger('popAnimation', [
      transition(':enter', [
        style({width: '0px', opacity: 0, transform: 'translateX(-100%)'}),
        animate('300ms ease-out', style({width: '19px', opacity: 1, transform: 'translateX(0)'}))
      ]),
      transition(':leave', [
        style({width: '19px', opacity: 1, transform: 'translateX(0)'}),
        animate('300ms ease-out', style({width: '0px', opacity: 0, transform: 'translateX(-100%)'}))
      ])
    ])
  ]
})
export class SpinnerComponent {
  @HostBinding('@popAnimation') popAnimation = true;

  @Input('class') clazz                   = '';
  @Input('id') id: number | string | null = null;
}
