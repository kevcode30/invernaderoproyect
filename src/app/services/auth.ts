// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
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
  private initializationComplete = false;
  private firebaseAuthSubscription?: Subscription;

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
    console.log('AuthService: Inicializando autenticación...');
    
    // Esperar a que Firebase esté listo
    await this.authApi.waitForInitialization();
    
    // Cargar usuario desde storage primero (para modo offline)
    await this.loadUserFromStorage();
    
    // Suscribirse a cambios en Firebase
    this.subscribeToFirebaseAuth();
    
    this.initializationComplete = true;
    console.log('AuthService: Inicialización completa');
  }

  // Suscribirse a cambios en el estado de autenticación de Firebase
  private subscribeToFirebaseAuth(): void {
    this.firebaseAuthSubscription = this.authApi.authState$.subscribe(async (firebaseUser) => {
      console.log('AuthService: Firebase auth state cambió:', firebaseUser ? firebaseUser.email : 'null');
      
      if (firebaseUser) {
        // Si hay usuario en Firebase, actualizar nuestro estado
        const currentUser = this.currentUserSubject.value;
        
        // Solo actualizar si el UID cambió o no hay usuario actual
        if (!currentUser || currentUser.uid !== firebaseUser.uid) {
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
          console.log('AuthService: Usuario actualizado desde Firebase:', user.getDisplayName());
        }
      } else {
        // Si no hay usuario en Firebase, limpiar
        if (this.currentUserSubject.value !== null) {
          console.log('AuthService: No hay usuario en Firebase, limpiando estado');
          this.currentUserSubject.next(null);
        }
      }
    });
  }

  // Esperar a que la autenticación esté lista
  async waitForAuthReady(): Promise<void> {
    if (this.initializationComplete) return;
    
    // Esperar máximo 5 segundos
    let attempts = 0;
    while (!this.initializationComplete && attempts < 50) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    console.log('AuthService: waitForAuthReady completado');
  }

  // Esperar a que el usuario esté disponible
  async waitForUser(): Promise<User> {
    const currentUser = this.currentUserSubject.value;
    if (currentUser) {
      console.log('AuthService: Usuario ya disponible:', currentUser.getDisplayName());
      return currentUser;
    }

    console.log('AuthService: Esperando usuario...');
    
    // Esperar al próximo valor no-null con timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Timeout esperando usuario')), 5000);
    });
    
    const userPromise = firstValueFrom(
      this.currentUser$.pipe(
        filter(user => user !== null),
        take(1)
      )
    ) as Promise<User>;
    
    try {
      const user = await Promise.race([userPromise, timeoutPromise]);
      console.log('AuthService: Usuario disponible:', user.getDisplayName());
      return user;
    } catch (error) {
      console.error('AuthService: Error esperando usuario:', error);
      throw new Error('No se pudo obtener el usuario');
    }
  }

  // RF.1 - Autentificar usuario al iniciar sesión
  async login(email: string, password: string): Promise<User> {
    try {
      console.log('AuthService: Iniciando login para', email);
      
      // Validar credenciales
      this.validateCredentials(email, password);

      // Llamar a la API
      const userData = await this.authApi.login(email, password);
      console.log('AuthService: Login exitoso en API');

      // Crear instancia de User
      const user = User.fromJSON({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      user.updateLastLogin();

      // Guardar en storage
      await this.storage.set(this.USER_STORAGE_KEY, user.toJSON());
      console.log('AuthService: Usuario guardado en storage');

      // Actualizar estado
      this.currentUserSubject.next(user);
      console.log('AuthService: Estado actualizado');
      
      // Pequeña pausa para asegurar propagación
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('AuthService: Login completado para', user.getDisplayName());
      return user;

    } catch (error: any) {
      console.error('AuthService: Error en login:', error);
      await this.logFailedAttempt(email);
      throw error; // Propagar el error original con su mensaje
    }
  }

  // RF.2 - Registro de usuario
  async register(email: string, password: string, displayName: string): Promise<User> {
    try {
      console.log('AuthService: Iniciando registro para', email);
      
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
      console.log('AuthService: Registro exitoso en API');

      // Crear instancia del modelo User
      const user = User.fromJSON({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Guardar en storage
      await this.storage.set(this.USER_STORAGE_KEY, user.toJSON());
      console.log('AuthService: Usuario guardado en storage');
      
      // Actualizar estado
      this.currentUserSubject.next(user);
      console.log('AuthService: Estado actualizado');
      
      // Pequeña pausa para asegurar propagación
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('AuthService: Registro completado para', user.getDisplayName());
      return user;

    } catch (error: any) {
      console.error('AuthService: Error en registro:', error);
      throw error; // Propagar el error original con su mensaje
    }
  }

  // RF.19 - Recuperación de contraseña
  async resetPassword(email: string): Promise<void> {
    try {
      await this.authApi.sendPasswordReset(email);
      console.log('AuthService: Email de recuperación enviado a:', email);
    } catch (error) {
      console.error('AuthService: Error al enviar email de recuperación:', error);
      throw error;
    }
  }

  // RF.5 - Cambio de contraseña
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) throw new Error('Usuario no autenticado');

    try {
      this.validatePassword(newPassword);
      await this.authApi.changePassword(user.uid, currentPassword, newPassword);
      console.log('AuthService: Contraseña actualizada exitosamente');
    } catch (error) {
      console.error('AuthService: Error al cambiar contraseña:', error);
      throw error;
    }
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      console.log('AuthService: Cerrando sesión...');
      
      // Primero cerrar sesión en Firebase
      await this.authApi.logout();
      console.log('AuthService: Sesión cerrada en Firebase');
      
      // Limpiar storage local
      await this.storage.remove(this.USER_STORAGE_KEY);
      console.log('AuthService: Storage limpiado');
      
      // Actualizar estado
      this.currentUserSubject.next(null);
      console.log('AuthService: Sesión cerrada completamente');
      
    } catch (error) {
      console.error('AuthService: Error al cerrar sesión:', error);
      
      // Incluso si hay error, intentar limpiar el estado local
      try {
        await this.storage.remove(this.USER_STORAGE_KEY);
        this.currentUserSubject.next(null);
      } catch (cleanupError) {
        console.error('AuthService: Error en limpieza de emergencia:', cleanupError);
      }
      
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

  // Cargar usuario desde storage
  private async loadUserFromStorage(): Promise<void> {
    try {
      const userData = await this.storage.get(this.USER_STORAGE_KEY);
      if (userData) {
        const user = User.fromJSON(userData);
        this.currentUserSubject.next(user);
        console.log('AuthService: Usuario cargado desde storage:', user.getDisplayName());
      } else {
        console.log('AuthService: No hay usuario en storage');
      }
    } catch (error) {
      console.error('AuthService: Error al cargar usuario desde storage:', error);
    }
  }

  // Validaciones
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

  private async logFailedAttempt(email: string): Promise<void> {
    try {
      const attempts = await this.storage.get(`failed_attempts_${email}`) || 0;
      await this.storage.set(`failed_attempts_${email}`, attempts + 1);

      if (attempts >= 4) {
        console.warn('AuthService: Múltiples intentos fallidos detectados para:', email);
      }
    } catch (error) {
      console.error('AuthService: Error al registrar intento fallido:', error);
    }
  }

  // Cleanup al destruir el servicio
  ngOnDestroy(): void {
    if (this.firebaseAuthSubscription) {
      this.firebaseAuthSubscription.unsubscribe();
    }
  }
}