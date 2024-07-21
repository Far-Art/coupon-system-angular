import {Component, ElementRef, HostListener, OnDestroy, OnInit, Self} from '@angular/core';
import {Subscription} from 'rxjs';
import {BackdropService} from './backdrop.service';


@Component({
  selector: 'cs-backdrop',
  templateUrl: './backdrop.component.html',
  styleUrls: ['./backdrop.component.scss']
})
export class BackdropComponent implements OnInit, OnDestroy {

  isVisible: boolean;

  private subscription: Subscription;

  constructor(private backdropService: BackdropService, @Self() elRef: ElementRef) {
    backdropService['registerContainer'](elRef);
  }

  ngOnInit(): void {
    this.subscription = this.backdropService.isVisible$().subscribe(isVisible => {
      this.isVisible = isVisible;
    });
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    this.backdropService['onBackdropClick'](event);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
