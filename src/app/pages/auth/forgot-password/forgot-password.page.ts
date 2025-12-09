// src/app/pages/auth/forgot-password/forgot-password.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, NavController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  forgotPasswordForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }

  async onSubmit() {
    if (this.forgotPasswordForm.invalid || this.isSubmitting) {
      this.email?.markAsTouched();
      return;
    }

    this.isSubmitting = true;

    const loading = await this.loadingCtrl.create({
      message: 'Enviando correo...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const email = this.forgotPasswordForm.value.email;
      
      // Enviar email de recuperación
      await this.authService.resetPassword(email);
      
      await loading.dismiss();
      
      // Mostrar mensaje de éxito con toast
      await this.showSuccessToast();
      
      // Mostrar alerta informativa
      await this.showSuccessAlert(email);
      
      // Resetear el formulario
      this.forgotPasswordForm.reset();
      this.isSubmitting = false;
      
    } catch (error: any) {
      await loading.dismiss();
      this.isSubmitting = false;
      
      console.error('Error al enviar correo de recuperación:', error);
      await this.showErrorAlert(error.message || 'Error al enviar el correo de recuperación');
    }
  }

  async showSuccessToast() {
    const toast = await this.toastCtrl.create({
      message: '✓ Correo enviado exitosamente',
      duration: 3000,
      position: 'top',
      color: 'success',
      cssClass: 'custom-toast'
    });
    await toast.present();
  }

  async showSuccessAlert(email: string) {
    const alert = await this.alertCtrl.create({
      header: '✓ Correo Enviado',
      message: `Se ha enviado un correo de recuperación a ${email}.\n\nPor favor revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.`,
      buttons: [
        {
          text: 'Entendido',
          role: 'confirm',
          cssClass: 'alert-button-confirm',
          handler: () => {
            // Volver al login después de confirmar
            this.goBack();
          }
        }
      ],
      cssClass: 'custom-alert'
    });
    await alert.present();
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  goBack() {
    this.router.navigate(['/auth/login'], { replaceUrl: true });
  }

  getEmailErrorMessage(): string {
    if (this.email?.hasError('required')) {
      return 'El correo electrónico es requerido';
    }
    if (this.email?.hasError('email')) {
      return 'Ingrese un correo electrónico válido';
    }
    return '';
  }
}