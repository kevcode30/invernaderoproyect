// src/app/pages/home/home.page.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit, OnDestroy {
  userName: string = 'Usuario';
  userEmail: string = '';
  isLoading: boolean = true;
  
  private userSubscription?: Subscription;
  
  sensorData = {
    temperature: 24.5,
    humidity: 68,
    light: 75,
    soilMoisture: 52
  };

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

  async ngOnInit() {
    console.log('HomePage ngOnInit - Iniciando carga');
    
    await this.authService.waitForAuthReady();
    
    const user = this.authService.getCurrentUser();
    
    if (!user) {
      console.warn('No hay usuario autenticado, redirigiendo a login');
      await this.router.navigate(['/auth/login'], { replaceUrl: true });
      return;
    }

    console.log('Usuario encontrado:', user.getDisplayName());

    this.userSubscription = this.authService.currentUser$.subscribe(userData => {
      if (userData) {
        console.log('Usuario actualizado en subscription:', userData.getDisplayName());
        this.userName = userData.getDisplayName();
        this.userEmail = userData.email;
        this.isLoading = false;
      } else {
        console.warn('Usuario null en subscription');
      }
    });

    await this.loadUserData();
    
    console.log('HomePage carga completa');
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  async loadUserData() {
    try {
      let user = this.authService.getCurrentUser();
      
      if (!user) {
        console.log('Esperando usuario...');
        user = await this.authService.waitForUser();
      }
      
      if (user) {
        console.log('Datos de usuario cargados:', user.getDisplayName());
        this.userName = user.getDisplayName();
        this.userEmail = user.email;
        this.isLoading = false;
      } else {
        console.error('No se pudo cargar el usuario');
        await this.router.navigate(['/auth/login'], { replaceUrl: true });
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      this.isLoading = false;
      await this.router.navigate(['/auth/login'], { replaceUrl: true });
    }
  }

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

  // RUTAS CORREGIDAS
  goToSensors() {
    this.router.navigate(['/sensors/list']);
  }

  goToControl() {
    this.router.navigate(['/control/manual']);
  }

  goToReports() {
    this.router.navigate(['/reports/list']);
  }

  goToAlerts() {
    this.router.navigate(['/alerts/list']);
  }

  goToProfile() {
    this.router.navigate(['/profile/view']);
  }

  goToSettings() {
    this.router.navigate(['/greenhouse/settings']);
  }

  // LOGOUT CORREGIDO
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
            try {
              console.log('Cerrando sesión...');
              await this.authService.logout();
              console.log('Sesión cerrada, navegando a login');
              await this.router.navigate(['/auth/login'], { replaceUrl: true });
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              this.showToast('Error al cerrar sesión');
              // Intentar navegar de todos modos
              await this.router.navigate(['/auth/login'], { replaceUrl: true });
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async refreshData(event?: any) {
    try {
      await this.loadUserData();
      
      if (event) {
        event.target.complete();
      }
      
      this.showToast('Datos actualizados');
    } catch (error) {
      console.error('Error al refrescar datos:', error);
      if (event) {
        event.target.complete();
      }
    }
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