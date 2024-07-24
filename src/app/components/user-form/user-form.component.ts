import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user';
import { SharingDataService } from '../../services/sharing-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'user-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent {
  user: User;

  constructor(private sharingData: SharingDataService,
              private router: Router) {
    if (this.router.getCurrentNavigation()?.extras.state) {
      this.user = this.router.getCurrentNavigation()?.extras.state!['user'];
    } else {
      this.user = new User();
    }
  }

  onSubmit(userForm: NgForm) {
    if (userForm.valid) {
      this.sharingData.newUserEventEmitter.emit(this.user);
      console.log(this.user);
    }
    userForm.reset();
    userForm.resetForm();
  }

  onClear(userForm: NgForm) {
    userForm.resetForm();
  }
}
