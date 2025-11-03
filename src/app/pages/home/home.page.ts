// src/app/pages/home/home.page.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
standalone:false
})
export class HomePage implements OnInit {
  userName: string = 'Usuario';
  userEmail: string = '';
  
  // Datos simulados de sensores (RF.10, RF.14)
  sensorData = {
    temperature: 24.5,
    humidity: 68,
    light: 75,
    soilMoisture: 52
  };

  // Estados de control (RF.36, RF.37)
  controls = {
    irrigation: false,
    ventilation: false,
    lighting: false,
    heating: false
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  // Cargar datos del usuario (RF.3)
  loadUserData() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.getDisplayName();
      this.userEmail = user.email;
    }
  }

  // RF.36, RF.37 - Control manual de dispositivos
  async toggleControl(controlName: 'irrigation' | 'ventilation' | 'lighting' | 'heating') {
    const isActive = this.controls[controlName];
    const actionText = isActive ? 'desactivar' : 'activar';
    const deviceName = this.getDeviceName(controlName);

    const alert = await this.alertCtrl.create({
      header: 'Confirmar Acción',
      message: `¿Deseas ${actionText} ${deviceName}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.controls[controlName] = !isActive;
            this.showToast(`${deviceName} ${isActive ? 'desactivado' : 'activado'}`);
          }
        }
      ]
    });

    await alert.present();
  }

  getDeviceName(control: string): string {
    const names: { [key: string]: string } = {
      irrigation: 'el riego',
      ventilation: 'la ventilación',
      lighting: 'la iluminación',
      heating: 'la calefacción'
    };
    return names[control] || control;
  }

  // Navegación
  goToSensors() {
    this.router.navigate(['/sensors']);
  }

  goToControl() {
    this.router.navigate(['/control']);
  }

  goToReports() {
    this.router.navigate(['/reports']);
  }

  goToAlerts() {
    this.router.navigate(['/alerts']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToSettings() {
    this.router.navigate(['/greenhouse/settings']);
  }

  // Cerrar sesión
  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro que deseas salir?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Salir',
          handler: async () => {
            await this.authService.logout();
            this.router.navigate(['/auth/login']);
          }
        }
      ]
    });

    await alert.present();
  }

  // Refrescar datos (RF.11)
  async refreshData(event?: any) {
    setTimeout(() => {
      this.loadUserData();
      if (event) {
        event.target.complete();
      }
      this.showToast('Datos actualizados');
    }, 1000);
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }

  getSensorColor(value: number, type: string): string {
    if (type === 'temperature') {
      if (value < 18) return 'primary';
      if (value > 28) return 'danger';
      return 'success';
    }
    if (type === 'humidity') {
      if (value < 50) return 'warning';
      if (value > 80) return 'danger';
      return 'success';
    }
    return 'success';
  }
}