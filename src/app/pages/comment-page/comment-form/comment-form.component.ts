import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'cs-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
})
export class CommentFormComponent implements OnInit {
  form: FormGroup;

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl<string>(null),
      name: new FormControl<string>(null),
      comment: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
  }

  onSubmit() {
    console.log(this.form.value);
  }

}
