import { Component, OnInit } from '@angular/core';
import { User, Session } from '../services/user';
import { SupabaseService } from '../services/supabase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SessionService } from '../services/session.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { OrientationLockOptions, ScreenOrientation } from '@capacitor/screen-orientation';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
  standalone: false,
})
export class SigninPage implements OnInit {

  user: User | null = null;

  public signinForm: FormGroup;
  loginError: string | null = null;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private sessionService: SessionService,
    private menuController: MenuController
  ) { 
    this.signinForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    
  }



  async onSubmit(){
    if (this.signinForm.valid) {
      var result = await this.sessionService.authenticate(this.signinForm.get('email')?.value, this.signinForm.get('password')?.value)
      if(result){
        await this.sessionService.createSession({
          id: result.id,
          email: result.email,
          name: result.name
        });
        this.router.navigateByUrl('/genres');
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

async ngOnInit() {}

  async ionViewWillEnter() {
    const options: OrientationLockOptions = { orientation: 'portrait' };
    ScreenOrientation.lock(options);
    this.menuController.enable(false);
    await this.sessionService.initStorage();
    await this.sessionService.loadSession();
    if (this.sessionService.hasSession()) {
      this.router.navigateByUrl('/genres');
    }
  }



  ionViewWillLeave() {
  this.signinForm.reset();
  Object.values(this.signinForm.controls).forEach(control => {
    control.setErrors(null);
    control.markAsPristine();
    control.markAsUntouched();
    control.updateValueAndValidity();
  });

    this.signinForm.updateValueAndValidity();
    this.signinForm.reset();
  }
}
