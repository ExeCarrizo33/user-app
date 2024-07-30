import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { UserComponent } from './user/user.component';
import { UserFormComponent } from './user-form/user-form.component';
import Swal from 'sweetalert2';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SharingDataService } from '../services/sharing-data.service';
import { skip } from 'rxjs';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './user-app.component.html',
  styleUrls: ['./user-app.component.css'],
})
export class UserAppComponent implements OnInit {
  users: User[] = [];

  constructor(
    private service: UserService,
    private sharingData: SharingDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.service.findAll().subscribe((users) => (this.users = users));
    this.addUser();
    this.removeUser();
    this.findUserById();
  }

  findUserById() {
    this.sharingData.findUserById.subscribe((id) => {
      const user = this.users.find((user) => user.id == id);
      this.sharingData.selectUser.emit(user);
    });
  }

  addUser() {
    this.sharingData.newUserEventEmitter.subscribe((user) => {
      if (user.id > 0) {
        this.service.update(user).subscribe({
          next: (userUpdate) => {
            this.users = this.users.map((u) =>
              u.id == userUpdate.id ? { ...userUpdate } : u
            );
            this.router.navigate(['/users'], { state: { users: this.users } });
             Swal.fire({
               title: 'Actualizado!',
               text: 'Usuario editado con éxito!',
               icon: 'success',
             });
          },
          error: (err) => {
          if (err.status == 400) {
            this.sharingData.errorsUser.emit(err.error);
          }
          },
        });
      } else {
        this.service.create(user).subscribe({
          next: (userNew) =>{
          this.users = [...this.users, { ...userNew }];
          this.router.navigate(['/users'], { state: { users: this.users } });
           Swal.fire({
             title: 'Creado nuevo usuario!',
             text: 'Usuario creado con éxito!',
             icon: 'success',
           });
        },
        error: (err) => {
          if (err.status == 400) {
            this.sharingData.errorsUser.emit(err.error);
          }
          },
      });
      }

    });
  }

  removeUser() {
    this.sharingData.idUserEvent.subscribe((id) => {
      Swal.fire({
        title: 'Seguro que quiere eliminar?',
        text: 'Cuidado el usuario sera eliminado!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.service.delete(id).subscribe(() => {
            this.users = this.users.filter((user) => user.id != id);
            this.router
              .navigate(['/users/create'], { skipLocationChange: true })
              .then(() => {
                this.router.navigate(['/users'], {
                  state: { users: this.users },
                });
              });
          });

          Swal.fire({
            title: 'Eliminado!',
            text: 'Usuario eliminado con éxito!.',
            icon: 'success',
          });
        }
      });
    });
  }
}
