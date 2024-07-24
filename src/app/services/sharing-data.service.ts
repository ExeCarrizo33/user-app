import { EventEmitter, Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class SharingDataService {
  private _newUserEventEmitter: EventEmitter<User> = new EventEmitter();

  private _idUserEvent = new EventEmitter();

  private _selectUserEvent = new EventEmitter();

  constructor() {}

  get newUserEventEmitter(): EventEmitter<User> {
    return this._newUserEventEmitter;
  }

  get idUserEvent(): EventEmitter<number> {
    return this._idUserEvent;
  }

  get selectUserEvent(): EventEmitter<User> {
    return this._selectUserEvent;
  }
}
