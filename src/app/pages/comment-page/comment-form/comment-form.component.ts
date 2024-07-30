import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DataManagerService} from '../../../shared/services/data-manager.service';
import {IdGeneratorService} from '../../../shared/services/id-generator.service';


@Component({
  selector: 'cs-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
})
export class CommentFormComponent implements OnInit {
  form: FormGroup;

  constructor(private dataManager: DataManagerService, private idGenerator: IdGeneratorService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl<string>(null),
      name: new FormControl<string>(null),
      comment: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
  }

  onSubmit() {
    this.dataManager.putComment(this.idGenerator.generate(10), this.form.value).subscribe({
      next: () => {
        this.form.reset();
      }
    });
  }

}
