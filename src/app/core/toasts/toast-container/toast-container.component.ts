import {Component, ViewContainerRef} from '@angular/core';
import {ToastService} from '../toast.service';


@Component({
  selector: 'cs-toast-container',
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss']
})
export class ToastContainerComponent {

  constructor(toastService: ToastService, viewContainerRef: ViewContainerRef) {
    toastService['container']        = viewContainerRef.element.nativeElement;
    toastService['viewContainerRef'] = viewContainerRef;
  }

}
