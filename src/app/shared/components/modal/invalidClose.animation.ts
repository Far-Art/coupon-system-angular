import {animate, AnimationTriggerMetadata, state, style, transition, trigger} from '@angular/animations';


export function invalidClose(): AnimationTriggerMetadata {
  return trigger('invalidClose', [
    state('true', style({transform: 'scale(102%)'})),
    state('false', style({transform: 'scale(100%)'})),
    transition('false <=> true', animate('380ms ease-out'))
  ]);
}
