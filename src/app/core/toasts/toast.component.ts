import {Component, HostBinding, OnInit, ViewRef} from '@angular/core';
import {ToastOptions, ToastService} from './toast.service';
import {translateInOut} from '../../shared/animations/translateInOut.animation';


@Component({
  selector: 'cs-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  animations: [translateInOut(400)]
})
export class ToastComponent implements OnInit {

  private readonly defaultTimeout = 4000;

  @HostBinding('@translateInOut') protected animation = true;

  options: ToastOptions;
  viewRef: ViewRef;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    if (this.options.dismiss === 'manual') {
      return;
    }
    setTimeout(() => {
      this.dismiss();
    }, this.options.timeout || this.defaultTimeout);
  }

  private dismiss() {
    this.toastService.dismiss(this.viewRef);
  }
}
