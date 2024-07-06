import {animate, AnimationTriggerMetadata, style, transition, trigger} from '@angular/animations';


export function TranslateInOut(timing: number, translateY: number = 15): AnimationTriggerMetadata {
  return trigger('translateInOut', [
    transition(':enter', [
      style({opacity: 0, transform: `translateY(-${translateY}%)`}), animate(`${timing}ms ease-out`, style({opacity: 1, transform: `translateY(${0}%)`}))
    ]), transition(':leave', [
      animate(`${timing}ms ease-in`, style({opacity: 0,transform: `translateY(-${translateY}%)`}))
    ])
  ]);
}