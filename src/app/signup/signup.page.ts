import { Component, OnInit } from '@angular/core';
import { User } from '../services/user';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false,
})
export class SignupPage implements OnInit {

  user : User;
  confirmPassword: string;
  test: User;  

  isLoadingUsers: boolean;

  constructor(private supabaseService: SupabaseService) {
    this.user = {
      email: '',
      password: '',
      name: ''
    }
    this.confirmPassword = '';
    this.isLoadingUsers = false;
    this.test = {
      email: '',
      password: '',
      name: ''
    }
  }

  async getUser(email: string){
    this.isLoadingUsers = true;
    var user = await this.supabaseService.getUserByEmail(email);
    this.isLoadingUsers = false;
    return user;
  }

  async insertUser(user: User) {
    console.log('User to insert:', JSON.stringify(user, null, 2));
    await this.supabaseService.insertUser(user);
  }

  async loadTestUser() {
    this.test = await this.getUser('admin@example.com');
  }

  ngOnInit() {
    this.loadTestUser();
  }

}
