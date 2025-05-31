import { Component, OnInit } from '@angular/core';
import { User } from '../services/user';
import { SupabaseService } from '../services/supabase.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
  standalone: false,
})
export class SigninPage implements OnInit {

  user: User;

  public signinForm: FormGroup;
  loginError: string | null = null;


  constructor(private supabaseService: SupabaseService, private formBuilder: FormBuilder) { 
    this.user = {
      email: '',
      password: '',
      name: '',
    };

    this.signinForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

  }

  private async authenticate(email: string, password: string): Promise<boolean> {
    try {
      this.user = await this.supabaseService.getUserByEmail(email);
      return this.user.password === password;
    } catch (error) {
      return false;
    }
  }

  async onSubmit(){
    if (this.signinForm.valid) {
      var result = await this.authenticate(this.signinForm.get('email')?.value, this.signinForm.get('password')?.value)
      if(result){
        this.loginError = 'Nice :)';
      } else {
        this.loginError = 'Invalid email or password';
      }
    } else {
      // marcar todos os campos como tocados para exibição das mensagens de erro
      Object.values(this.signinForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  ngOnInit() {
  }

}
