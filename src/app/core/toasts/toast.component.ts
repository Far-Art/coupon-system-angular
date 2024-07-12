import {Component} from '@angular/core';
import {ToastOptions} from './toast.service';


@Component({
  selector: 'cs-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {

  options: ToastOptions;
}
