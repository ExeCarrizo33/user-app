import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: User[] = [
    {
      id: 1,
      name: 'Exe',
      lastname: 'Carrizo',
      email: 'exelcarrizo@gmail.com',
      username: 'exe',
      password: '123456',
    },
    {
      id: 2,
      name: 'Jorge',
      lastname: 'Miller',
      email: 'jorge@gmail.com',
      username: 'jorge',
      password: '123456',
    },
  ];
  constructor() {}

  findAll(): Observable<User[]> {
    return of(this.users);
  }
}
