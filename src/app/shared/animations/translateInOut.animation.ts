import {animate, AnimationTriggerMetadata, style, transition, trigger} from '@angular/animations';


const translateYDefaultValue = 15;
const blurDefaultValue       = 0;

export function translateInOut(timing: number, options?: { translateY?: number }): AnimationTriggerMetadata {
  return trigger('translateInOut', [
    transition(':enter', [
      style({
        opacity: 0,
        transform: `translateY(-${options?.translateY || translateYDefaultValue}%)`
      }),
      animate(`${timing}ms ease-out`, style({
        opacity: 1,
        transform: `translateY(${0}%)`
      }))
    ]),
    transition(':leave', [
      style({
        opacity: 1,
        transform: `translateY(${0}%)`
      }),
      animate(`${timing}ms ease-in`, style({
        opacity: 0,
        transform: `translateY(-${options?.translateY || translateYDefaultValue}%)`
      }))
    ])
  ]);
}

export function translateInOutWithBlur(timing: number, options?: { translateY?: number, blur: number }): AnimationTriggerMetadata {
  return trigger('translateInOutWithBlur', [
    transition(':enter', [
      style({
        backdropFilter: `blur(${options?.blur || blurDefaultValue}px)`,
        opacity: 0,
        transform: `translateY(-${options?.translateY || translateYDefaultValue}%)`
      }), animate(`${timing}ms ease-out`, style({
        backdropFilter: `blur(${options?.blur || blurDefaultValue}px)`,
        opacity: 1,
        transform: `translateY(${0}%)`
      }))
    ]), transition(':leave', [
      style({
        backdropFilter: `blur(${options?.blur || blurDefaultValue}px)`,
        opacity: 1,
        transform: `translateY(${0}%)`
      }),
      animate(`${timing}ms ease-in`, style({
        backdropFilter: `blur(${options?.blur || blurDefaultValue}px)`,
        opacity: 0,
        transform: `translateY(-${options?.translateY || translateYDefaultValue}%)`
      }))
    ])
  ]);
}