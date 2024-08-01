import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import Swal from 'sweetalert2';
import { SharingDataService } from '../../services/sharing-data.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  titulo: string = 'Por favor Sign In!';
  user: User;

  constructor(private sharingData: SharingDataService) {
    this.user = new User();
  }

   onSubmit(): void {
    if (!this.user.username  || !this.user.password) {
      Swal.fire('Error Login', 'Username o password vacías!', 'error');
    }else {
      this.sharingData.handlerLoginEventEmitter.emit({username: this.user.username,password: this.user.password});
    }

  }
}