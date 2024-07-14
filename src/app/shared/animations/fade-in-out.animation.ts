import {animate, AnimationTriggerMetadata, style, transition, trigger} from '@angular/animations';


export function fadeInOut(timing: number): AnimationTriggerMetadata {
  return trigger('fadeInOut', [
    transition(':enter', [
      style({opacity: 0}),
      animate(timing, style({opacity: 1}))
    ]),
    transition(':leave', [
      animate(timing, style({opacity: 0}))
    ])
  ]);
}