import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { add, find, resetUser, update } from '../../store/users/users.actions';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'user-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {
  user: User;
  errors: any = {};

  constructor(
    private store: Store<{ users: any }>,
    private route: ActivatedRoute
  ) {
    this.user = new User();
    this.store.select('users').subscribe((state) => {
      (this.errors = state.errors), (this.user = { ...state.user });
    });
  }
  ngOnInit(): void {
    this.store.dispatch(resetUser());
    this.route.paramMap.subscribe((params) => {
      const id: number = +(params.get('id') || '0');
      if (id > 0) {
        this.store.dispatch(find({ id }));
      }
    });
  }

  onSubmit(userForm: NgForm) {
    if (this.user.id > 0) {
      this.store.dispatch(update({ userUpdated: this.user }));
    } else {
      this.store.dispatch(add({ userNew: this.user }));
    }
  }

  onClear(userForm: NgForm) {
    this.store.dispatch(resetUser());
  }
}
