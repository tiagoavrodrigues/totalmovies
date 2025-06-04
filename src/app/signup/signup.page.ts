import { Component, OnInit } from '@angular/core';
import { Session, User } from '../services/user';
import { SupabaseService } from '../services/supabase.service';
import { AbstractControl, EmailValidator, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SessionService } from '../services/session.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false,
})
export class SignupPage implements OnInit {

  newUser : User;
  confirmPassword: string;

  public signupForm: FormGroup;

  constructor(
    private supabaseService: SupabaseService,
    private formBuilder: FormBuilder,
    private sessionService: SessionService,
    private router: Router,
    private menuController: MenuController){
    
    this.newUser = {
      email: '',
      password: '',
      name: ''
    }

    this.confirmPassword = '';

    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email], [this.emailTakenValidator.bind(this)]], // "this" vai-se referir a este componente dentro da funcao
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(5)]],
    },
    { validators: this.passwordMatchValidator }
    );
  }

  async onSubmit(){
    if (!this.signupForm.valid) {
        // marcar todos os campos como tocados para exibição das mensagens de erro
      Object.values(this.signupForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    this.newUser = {
      email: this.signupForm.get('email')!.value,
      password: this.signupForm.get('password')!.value,
      name: this.signupForm.get('name')!.value
    }
    await this.redirectNewUser(this.newUser);
  }

private emailTakenValidator(fromControl: AbstractControl): Promise<{ emailTaken: boolean } | null> { //Promise == async
  const email = fromControl.value?.trim();
  if (!email) return Promise.resolve(null);

  return this.supabaseService.getUserByEmail(email)
    .then(user => user ? { emailTaken: true } : null)
    .catch(() => null); // ignore Supabase errors
}

  private passwordMatchValidator(formGroup: AbstractControl): { [key: string]: boolean } | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.menuController.enable(false);
  }

  ionViewWillLeave() {
    this.signupForm.reset();
    Object.values(this.signupForm.controls).forEach(control => {
      control.setErrors(null);
      control.markAsPristine();
      control.markAsUntouched();
      control.updateValueAndValidity();
    });

    this.signupForm.updateValueAndValidity();
    this.signupForm.reset();
  }

  async redirectNewUser(session: Session){
    console.log('got here bro');
    await this.supabaseService.insertUser(this.newUser);

    const auth = await this.sessionService.authenticate(this.newUser.email, this.newUser.password)
    if(auth){
      await this.sessionService.initStorage();
      await this.sessionService.createSession(auth);
      this.router.navigateByUrl('/genres');
    }
  }
}
