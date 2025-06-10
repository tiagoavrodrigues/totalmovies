import { Component, OnInit } from '@angular/core';
import { User } from '../services/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SessionService } from '../services/session.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { OrientationLockOptions, ScreenOrientation } from '@capacitor/screen-orientation';
import { LoadingController } from '@ionic/angular/standalone';
import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
  standalone: false,
})
export class SigninPage implements OnInit{

  user: User | null = null;

  public signinForm: FormGroup;
  loginError: string | null = null;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private sessionService: SessionService,
    private menuController: MenuController,
    private loadingController: LoadingController,
  ) { 
    this.signinForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    
  }



  async onSubmit(){
    if (this.signinForm.valid) {
      const loading = await this.loadingController.create({
      message: 'Signing in...',
      spinner: 'lines'
      });
      loading.present();

      var result = await this.sessionService.authenticate(this.signinForm.get('email')?.value, this.signinForm.get('password')?.value)
      if(result){
        await this.sessionService.createSession({
          id: result.id,
          email: result.email,
          name: result.name
        });
        loading.dismiss();
        this.router.navigateByUrl('/genres', { replaceUrl: true });
      } else {
        this.loginError = 'Invalid email or password';
        loading.dismiss();
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
    await StatusBar.hide();
    await ScreenOrientation.lock(options);
    this.menuController.enable(false);
    this.sessionService.initStorage();
    this.sessionService.loadSession();
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
