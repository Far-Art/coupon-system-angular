import {animate, AnimationTriggerMetadata, style, transition, trigger} from '@angular/animations';


export function FadeInOut(timingIn: number, timingOut: number = timingIn, opacity: number = 1, height: boolean = false): AnimationTriggerMetadata {
  return trigger('fadeInOut', [
    transition(':enter', [
      style(height ? {opacity: 0, height: 0} : {opacity: 0}),
      animate(timingIn, style(height ? {opacity: opacity, height: 'fit-content'} : {opacity: opacity}))
    ]),
    transition(':leave', [
      animate(timingOut, style(height ? {opacity: 0, height: 0} : {opacity: 0}))
    ])
  ]);
}