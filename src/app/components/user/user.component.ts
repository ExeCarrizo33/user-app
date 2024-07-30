import { Component, EventEmitter, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SharingDataService } from '../../services/sharing-data.service';

@Component({
  selector: 'user',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {
  title = 'Listado de usuarios!';

  users: User[] = [];

  constructor(
    private router: Router,
    private service: UserService,
    private sharingData: SharingDataService
  ) {
    if (this.router.getCurrentNavigation()?.extras.state) {
      this.users = this.router.getCurrentNavigation()?.extras.state!['users'];
    }
  }
  ngOnInit(): void {
    if (this.users == undefined || this.users.length == 0) {
      this.service.findAll().subscribe((users) => (this.users = users));
    }
  }

  onRemoveUser(id: number) {
    this.sharingData.idUserEvent.emit(id);
  }

  onSelectUser(user: User) {
    this.router.navigate(['users/edit', user.id], { state: { user } });
  }
}
