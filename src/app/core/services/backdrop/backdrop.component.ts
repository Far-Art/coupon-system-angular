import {Component, ElementRef, HostListener, Self} from '@angular/core';
import {BackdropService} from './backdrop.service';


@Component({
  selector: 'cs-backdrop',
  templateUrl: './backdrop.component.html',
  styleUrls: ['./backdrop.component.scss']
})
export class BackdropComponent {

  constructor(private backdropService: BackdropService, @Self() elRef: ElementRef) {
    backdropService['registerContainer'](elRef);
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    this.backdropService['onBackdropClick'](event);
  }

}
