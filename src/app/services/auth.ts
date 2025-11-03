// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserRole } from '../domain/models/user-module';
import { AuthApiService } from '../data/api/auth-api-service';
import { StorageService } from '../data/api/storage-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  private readonly USER_STORAGE_KEY = 'currentUser';

  constructor(
    private authApi: AuthApiService,
    private storage: StorageService
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.initializeAuth();
  }

  // Inicializar autenticación
  private async initializeAuth(): Promise<void> {
    // Primero intentar cargar desde storage
    await this.loadUserFromStorage();
    
    // Luego verificar si Firebase tiene un usuario activo
    await this.syncWithFirebase();
  }

  // Sincronizar con Firebase
  private async syncWithFirebase(): Promise<void> {
    try {
      const firebaseUser = this.authApi.getCurrentFirebaseUser();
      
      if (firebaseUser) {
        // Si hay usuario en Firebase pero no en nuestro estado
        if (!this.currentUserSubject.value) {
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'Usuario',
            role: UserRole.USER,
            photoURL: firebaseUser.photoURL,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          const user = User.fromJSON(userData);
          await this.storage.set(this.USER_STORAGE_KEY, user.toJSON());
          this.currentUserSubject.next(user);
          console.log('Usuario sincronizado desde Firebase');
        }
      }
    } catch (error) {
      console.error('Error al sincronizar con Firebase:', error);
    }
  }

  // RF.1 - Autentificar usuario al iniciar sesión
  async login(email: string, password: string): Promise<User> {
    try {
      // Validar credenciales (RNF.6)
      this.validateCredentials(email, password);

      // Llamar a la API
      const userData = await this.authApi.login(email, password);

      // Crear instancia de User con fechas válidas
      const user = User.fromJSON({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      user.updateLastLogin(); // RF.81 - Registro de ingresos

      // Guardar en storage local (RF.33 - Acceso offline)
      await this.storage.set(this.USER_STORAGE_KEY, user.toJSON());

      // Actualizar estado - esto dispara el observable
      this.currentUserSubject.next(user);

      console.log('Login exitoso:', user.getDisplayName());
      return user;

    } catch (error: any) {
      console.error('Error en login:', error);
      
      // RNF.52, RNF.53 - Registro de intentos fallidos
      await this.logFailedAttempt(email);
      
      throw new Error(this.getLoginErrorMessage(error));
    }
  }

  // RF.2 - Registro de usuario
  async register(email: string, password: string, displayName: string): Promise<User> {
    try {
      // Validar datos
      this.validateCredentials(email, password);
      this.validateDisplayName(displayName);

      // Crear usuario en la API
      const userData = await this.authApi.register({
        email,
        password,
        displayName,
        role: UserRole.USER
      });

      // Crear instancia del modelo User
      const user = User.fromJSON({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Guardar en storage
      await this.storage.set(this.USER_STORAGE_KEY, user.toJSON());
      this.currentUserSubject.next(user);

      return user;

    } catch (error: any) {
      console.error('Error en registro:', error);

      if (error.message?.includes('contraseña') || error.message?.includes('Correo')) {
        throw error;
      }

      throw new Error('Error al crear la cuenta. Intente nuevamente.');
    }
  }

  // RF.19 - Recuperación de contraseña
  async resetPassword(email: string): Promise<void> {
    try {
      await this.authApi.sendPasswordReset(email);
      console.log('Email de recuperación enviado a:', email);
    } catch (error) {
      console.error('Error al enviar email de recuperación:', error);
      throw new Error('No se pudo enviar el correo de recuperación.');
    }
  }

  // RF.5 - Cambio de contraseña
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) throw new Error('Usuario no autenticado');

    try {
      // RNF.54 - Validar contraseña segura
      this.validatePassword(newPassword);
      
      await this.authApi.changePassword(user.uid, currentPassword, newPassword);
      console.log('Contraseña actualizada exitosamente');
      
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      throw new Error('No se pudo cambiar la contraseña.');
    }
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      await this.authApi.logout();
      await this.storage.remove(this.USER_STORAGE_KEY);
      this.currentUserSubject.next(null);
      console.log('Sesión cerrada exitosamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw new Error('Error al cerrar sesión');
    }
  }

  // Obtener usuario actual
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  // RF.45 - Control de acceso por roles
  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role || false;
  }

  isAdmin(): boolean {
    return this.hasRole(UserRole.ADMIN);
  }

  // Cargar usuario desde storage (RF.33 - Acceso offline)
  private async loadUserFromStorage(): Promise<void> {
    try {
      const userData = await this.storage.get(this.USER_STORAGE_KEY);
      if (userData) {
        const user = User.fromJSON(userData);
        this.currentUserSubject.next(user);
        console.log('Usuario cargado desde storage:', user.getDisplayName());
      }
    } catch (error) {
      console.error('Error al cargar usuario:', error);
    }
  }

  // Validaciones (RNF.6, RNF.54)
  private validateCredentials(email: string, password: string): void {
    if (!email || !this.isValidEmail(email)) {
      throw new Error('Correo electrónico inválido');
    }
    this.validatePassword(password);
  }

  private validatePassword(password: string): void {
    if (!password || password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }
    // RNF.54 - Contraseña segura
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
      throw new Error('La contraseña debe contener mayúsculas, minúsculas, números y símbolos');
    }
  }

  private validateDisplayName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new Error('El nombre debe tener al menos 2 caracteres');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // RNF.52, RNF.53 - Registro de intentos fallidos
  private async logFailedAttempt(email: string): Promise<void> {
    const attempts = await this.storage.get(`failed_attempts_${email}`) || 0;
    await this.storage.set(`failed_attempts_${email}`, attempts + 1);

    // RNF.129 - Notificar después de múltiples intentos
    if (attempts >= 4) {
      console.warn('Múltiples intentos fallidos detectados para:', email);
    }
  }

  private getLoginErrorMessage(error: any): string {
    const errorCode = error.code || error.message;
    
    const errorMessages: { [key: string]: string } = {
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/invalid-email': 'Correo electrónico inválido',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
      'auth/too-many-requests': 'Demasiados intentos. Intente más tarde',
      'auth/network-request-failed': 'Error de conexión. Verifique su internet'
    };

    return errorMessages[errorCode] || 'Error al iniciar sesión. Intente nuevamente.';
  }
}