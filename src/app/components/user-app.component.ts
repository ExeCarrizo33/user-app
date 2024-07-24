import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { UserComponent } from './user/user.component';
import { UserFormComponent } from './user-form/user-form.component';
import Swal from 'sweetalert2';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './user-app.component.html',
  styleUrls:['./user-app.component.css']
})
export class UserAppComponent implements OnInit {

  users: User[] = [];

  userSelected: User;

  constructor(private service: UserService) {
    this.userSelected = new User();
  }
  ngOnInit(): void {
    this.service.findAll().subscribe((users) => (this.users = users));
  }

  addUser(user: User) {
    if (user.id > 0) {
      this.users = this.users.map((u) => (u.id == user.id ? { ...user } : u));
    } else {
      this.users = [...this.users, { ...user, id: new Date().getTime() }];
    }
    Swal.fire({
      title: 'Guardado!',
      text: 'Usuario Guardado con éxito!',
      icon: 'success',
    });
    this.userSelected = new User();
  }

  removeUser(id: number) {
    Swal.fire({
      title: 'Seguro que quiere eliminar?',
      text: "Cuidado el usuario sera eliminado!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.users = this.users.filter((user) => user.id != id);
        Swal.fire({
          title: 'Eliminado!',
          text: 'Usuario eliminado con éxito!.',
          icon: 'success',
        });
      }
    });
  }

  setSelectUser(userRow: User) {
    this.userSelected = { ...userRow };

  }


}
