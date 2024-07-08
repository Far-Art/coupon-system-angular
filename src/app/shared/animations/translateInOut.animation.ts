import {animate, AnimationTriggerMetadata, style, transition, trigger} from '@angular/animations';


export function TranslateInOut(timing: number, translateY: number = 15): AnimationTriggerMetadata {
  return trigger('translateInOut', [
    transition(':enter', [
      style({
        opacity: 0,
        transform: `translateY(-${translateY}%)`
      }), animate(`${timing}ms ease-out`, style({
        opacity: 1,
        transform: `translateY(${0}%)`
      }))
    ]), transition(':leave', [
      style({
        opacity: 1,
        transform: `translateY(${0}%)`
      }),
      animate(`${timing}ms ease-in`, style({
        opacity: 0,
        transform: `translateY(-${translateY}%)`
      }))
    ])
  ]);
}

export function TranslateInOutWithBlur(timing: number, translateY: number = 15): AnimationTriggerMetadata {
  return trigger('translateInOutWithBlur', [
    transition(':enter', [
      style({
        backdropFilter: 'blur(40px)',
        opacity: 0,
        transform: `translateY(-${translateY}%)`
      }), animate(`${timing}ms ease-out`, style({
        backdropFilter: 'blur(40px)',
        opacity: 1,
        transform: `translateY(${0}%)`
      }))
    ]), transition(':leave', [
      style({
        backdropFilter: 'blur(40px)',
        opacity: 1,
        transform: `translateY(${0}%)`
      }),
      animate(`${timing}ms ease-in`, style({
        backdropFilter: 'blur(40px)',
        opacity: 0,
        transform: `translateY(-${translateY}%)`
      }))
    ])
  ]);
}