import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: User[] = [];

  constructor(private http: HttpClient) {}

  private url: string = 'http://localhost:8080/users';

  findAll(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  findAllPageable(page:number): Observable<any> {
    return this.http.get<any>(`${this.url}/page/${page}`);
  }

  findById(id: number): Observable<User> {
    return this.http.get<User>(`${this.url}/${id}`);
  }

  create(user: User): Observable<User>{
    return this.http.post<User>(this.url + '/save', user)
  }

  update(user:User): Observable<User>{
    return this.http.put<User>(`${this.url}/${user.id}`, user);
  }

  delete(id:number): Observable<number>{
    return this.http.delete<number>(`${this.url}/${id}`).pipe(
      map(() => id)
    );
  }
}
