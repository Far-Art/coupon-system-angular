import {animate, AnimationTriggerMetadata, state, style, transition, trigger} from '@angular/animations';


export function arrowAnimation(timing: number): AnimationTriggerMetadata {
  return trigger('arrowAnimation', [
    state('false', style({
      transform: `rotate(45deg)`,
      opacity: 0.85
    })),
    state('true', style({
      transform: `rotate(90deg)`,
      opacity: 1
    })),
    transition('false <=> true', animate(`${timing}ms ease-in-out`))
  ]);
}

export function textAnimation(timing: number): AnimationTriggerMetadata {
  return trigger('textAnimation', [
    state('false', style({opacity: 0.85})),
    state('true', style({opacity: 1})),
    transition('false <=> true', animate(`${timing}ms ease-in-out`))
  ]);
}