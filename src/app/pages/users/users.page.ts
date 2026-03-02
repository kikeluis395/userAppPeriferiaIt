import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  standalone: false,
})
export class UsersPage implements OnInit {

  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';

  constructor(
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  async loadUsers(event?: any) {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando usuarios...'
    });

    if (!event) await loading.present();

    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
        loading.dismiss();
        event?.target.complete();
      },
      error: async () => {
        loading.dismiss();
        event?.target.complete();

        const toast = await this.toastCtrl.create({
          message: 'Error cargando usuarios',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(word => word[0].toUpperCase())
      .join('');
  }
}