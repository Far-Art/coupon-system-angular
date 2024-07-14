import {animate, AnimationTriggerMetadata, state, style, transition, trigger} from '@angular/animations';


export function slowBlur(timing: number, blur = 20): AnimationTriggerMetadata {
  return trigger('slowBlur', [
    state('true', style({backdropFilter: `blur(${blur}px)`})),
    state('false', style({backdropFilter: `blur(0px)`})),
    transition(':enter', [
      animate(timing, style({backdropFilter: `blur(${blur}px)`})),
      state('enter', style({backdropFilter: `blur(${blur}px)`}))
    ]),
    transition(':leave', [
      style({backdropFilter: `blur(${blur}px)`}),
      animate(0, style({backdropFilter: `blur(0px)`})),
      state('leave', style({backdropFilter: `blur(0px)`}))
    ]),
    transition('false => true', animate(`${timing}ms ease-in`)),
    transition('true => false', animate(`${0}ms linear`))
  ]);
}