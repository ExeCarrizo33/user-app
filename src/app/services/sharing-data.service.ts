import { EventEmitter, Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class SharingDataService {
  private _newUserEventEmitter: EventEmitter<User> = new EventEmitter();

  private _idUserEvent = new EventEmitter();

  private _findUserById = new EventEmitter();

  private _selectUser = new EventEmitter();
  constructor() {}

  get newUserEventEmitter(): EventEmitter<User> {
    return this._newUserEventEmitter;
  }

  get idUserEvent(): EventEmitter<number> {
    return this._idUserEvent;
  }

  get findUserById() {
    return this._findUserById;
  }

  get selectUser() {
    return this._selectUser;
  }
}
