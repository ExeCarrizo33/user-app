import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { UserComponent } from './user/user.component';
import { UserFormComponent } from './user-form/user-form.component';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SharingDataService } from '../services/sharing-data.service';
import { skip } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './user-app.component.html',
  styleUrls: ['./user-app.component.css'],
})
export class UserAppComponent implements OnInit {
  users: User[] = [];

  paginator: any = {};

  constructor(
    private service: UserService,
    private sharingData: SharingDataService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // this.service.findAll().subscribe((users) => (this.users = users));
    // this.route.paramMap.subscribe(params => {
    //   const page = +(params.get('page') || '0');
    //   this.service.findAllPageable(page).subscribe(pageable => this.users = pageable.content as User[]);
    // })
    this.addUser();
    this.removeUser();
    this.findUserById();
    this.pageUserEvent();
  }

  handlerLogin(){
    this.sharingData.handlerLoginEventEmitter.subscribe(({username,password}) => {
      this.authService.loginUser({username,password}).subscribe({
        next: response => {
           const token = response.token;
           const payload = this.authService.getPayload(token);
           const user = { username: payload.sub};
           const login = {
            user,
            isAuth: true,
            isAdmin: payload.isAdmin
           }
           this.authService.token = token;
           this.authService.user = login;
           this.router.navigate(['/users/page/0']);

        },
        error: error=> {
            if (error.status == 401) {
              Swal.fire('Error en el login', error.error.message,'error')
            } else{
              throw error;
            }
        }
      })
    })
  }

  pageUserEvent(){
    this.sharingData.pageUserEventEmitter.subscribe(pageable => {
      this.users = pageable.users;
      this.paginator = pageable.paginator
    });
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
            this.router.navigate(['/users'], { state: { users: this.users, paginator: this.paginator } });
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
          this.router.navigate(['/users'], {
            state: { users: this.users, paginator: this.paginator },
          });
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
                  state: { users: this.users, paginator: this.paginator },
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
