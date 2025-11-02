// src/app/pages/auth/login/login.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, NavController, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  // Toggle entre Login y Registro
  isLoginMode = true;

  // Formularios
  loginForm!: FormGroup;
  registerForm!: FormGroup;

  // Estados
  showPassword = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForms();
  }

  // Inicializar ambos formularios
  initForms() {
    // Formulario de Login
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    // Formulario de Registro (RF.2)
    this.registerForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  // Cambiar entre Login y Registro
  setLoginMode(isLogin: boolean) {
    this.isLoginMode = isLogin;
    this.showPassword = false;
  }

  // Getters para Login Form
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  // Getters para Register Form
  get displayName() {
    return this.registerForm.get('displayName');
  }

  get registerEmail() {
    return this.registerForm.get('email');
  }

  get registerPassword() {
    return this.registerForm.get('password');
  }

  // Toggle para mostrar/ocultar contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // RF.1 - Iniciar sesión
  async onLogin() {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const { email, password } = this.loginForm.value;
      const user = await this.authService.login(email, password);

      await loading.dismiss();

      if (user) {
        this.showSuccessMessage('¡Bienvenido de nuevo!');
        await this.router.navigate(['/home']);
      }
    } catch (error: any) {
      await loading.dismiss();
      this.showErrorMessage(error.message || 'Error al iniciar sesión');
    }
  }

  // RF.2 - Registro de usuario
  async onRegister() {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Creando cuenta...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const { email, password, displayName } = this.registerForm.value;
      const user = await this.authService.register(email, password, displayName);

      await loading.dismiss();

      if (user) {
        this.showSuccessMessage('¡Cuenta creada exitosamente!');
        await this.router.navigate(['/home']);
      }
    } catch (error: any) {
      await loading.dismiss();
      this.showErrorMessage(error.message || 'Error al crear la cuenta');
    }
  }

  // RF.19 - Navegar a recuperación de contraseña
  goToForgotPassword() {
    this.navCtrl.navigateForward('/auth/forgot-password');
  }

  // Utilidades
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private async showSuccessMessage(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Éxito',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  private async showErrorMessage(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Mensajes de error para Login
  getEmailErrorMessage(): string {
    if (this.email?.hasError('required')) {
      return 'El correo electrónico es requerido';
    }
    if (this.email?.hasError('email')) {
      return 'Ingrese un correo electrónico válido';
    }
    return '';
  }

  getPasswordErrorMessage(): string {
    if (this.password?.hasError('required')) {
      return 'La contraseña es requerida';
    }
    if (this.password?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    return '';
  }

  // Mensajes de error para Registro
  getRegisterEmailErrorMessage(): string {
    if (this.registerEmail?.hasError('required')) {
      return 'El correo electrónico es requerido';
    }
    if (this.registerEmail?.hasError('email')) {
      return 'Ingrese un correo electrónico válido';
    }
    return '';
  }

  getRegisterPasswordErrorMessage(): string {
    if (this.registerPassword?.hasError('required')) {
      return 'La contraseña es requerida';
    }
    if (this.registerPassword?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    return '';
  }
}