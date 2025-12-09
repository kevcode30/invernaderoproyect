// src/app/data/api/auth-api-service.ts
import { Injectable } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  User as FirebaseUser,
  updateProfile,
  onAuthStateChanged,
  reauthenticateWithCredential,
  EmailAuthProvider
} from '@angular/fire/auth';
import { Observable, BehaviorSubject } from 'rxjs';

interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private authStateSubject = new BehaviorSubject<FirebaseUser | null>(null);
  public authState$: Observable<FirebaseUser | null> = this.authStateSubject.asObservable();
  private initializationPromise: Promise<void>;

  constructor(private auth: Auth) {
    console.log('AuthApiService: Inicializando...');
    
    // Escuchar cambios en el estado de autenticación de Firebase
    this.initializationPromise = this.initializeAuthListener();
  }

  // Inicializar listener de autenticación
  private initializeAuthListener(): Promise<void> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        console.log('Firebase Auth State Changed:', user ? user.email : 'null');
        this.authStateSubject.next(user);
        
        // Resolver en el primer cambio de estado
        resolve();
      }, (error) => {
        console.error('Error en Auth State Listener:', error);
        resolve(); // Resolver incluso si hay error
      });
    });
  }

  // Esperar a que Firebase esté listo
  async waitForInitialization(): Promise<void> {
    await this.initializationPromise;
  }

  // Login con Firebase
  async login(email: string, password: string): Promise<any> {
    try {
      console.log('AuthApiService: Intentando login con Firebase...');
      
      const userCredential = await signInWithEmailAndPassword(
        this.auth, 
        email, 
        password
      );

      const user = userCredential.user;
      console.log('AuthApiService: Login exitoso para', user.email);
      
      // Esperar a que el estado se actualice
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Obtener token
      const token = await user.getIdToken();
      
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Usuario',
        role: 'USER', // Por defecto, puedes guardar esto en Firestore
        token: token,
        photoURL: user.photoURL
      };
    } catch (error: any) {
      console.error('Error en login Firebase:', error);
      throw this.handleFirebaseError(error);
    }
  }

  // Registro con Firebase
  async register(userData: RegisterRequest): Promise<any> {
    try {
      console.log('AuthApiService: Intentando registro con Firebase...');
      
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        userData.email,
        userData.password
      );

      const user = userCredential.user;
      console.log('AuthApiService: Usuario creado en Firebase:', user.uid);

      // Actualizar perfil con displayName
      await updateProfile(user, {
        displayName: userData.displayName
      });

      console.log('AuthApiService: Perfil actualizado con displayName');

      // Esperar a que el estado se actualice
      await new Promise(resolve => setTimeout(resolve, 100));

      // Obtener token
      const token = await user.getIdToken();

      return {
        uid: user.uid,
        email: user.email,
        displayName: userData.displayName,
        role: userData.role,
        token: token,
        photoURL: user.photoURL
      };
    } catch (error: any) {
      console.error('Error en registro Firebase:', error);
      throw this.handleFirebaseError(error);
    }
  }

  // Recuperación de contraseña
  async sendPasswordReset(email: string): Promise<void> {
    try {
      console.log('AuthApiService: Enviando email de recuperación a', email);
      await sendPasswordResetEmail(this.auth, email);
      console.log('AuthApiService: Email de recuperación enviado');
    } catch (error: any) {
      console.error('Error al enviar email de recuperación:', error);
      throw this.handleFirebaseError(error);
    }
  }

  // Cambio de contraseña con reautenticación
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      const user = this.auth.currentUser;
      
      if (!user || !user.email) {
        throw new Error('No hay usuario autenticado');
      }

      console.log('AuthApiService: Reautenticando usuario para cambiar contraseña...');

      // Crear credencial para reautenticación
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      // Reautenticar
      await reauthenticateWithCredential(user, credential);
      console.log('AuthApiService: Usuario reautenticado');

      // Cambiar contraseña
      await updatePassword(user, newPassword);
      console.log('AuthApiService: Contraseña actualizada exitosamente');
      
    } catch (error: any) {
      console.error('Error al cambiar contraseña:', error);
      
      // Si el error es de contraseña incorrecta, dar un mensaje más claro
      if (error.code === 'auth/wrong-password') {
        throw new Error('La contraseña actual es incorrecta');
      }
      
      throw this.handleFirebaseError(error);
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      console.log('AuthApiService: Cerrando sesión en Firebase...');
      await signOut(this.auth);
      console.log('AuthApiService: Sesión cerrada exitosamente');
    } catch (error: any) {
      console.error('Error en logout Firebase:', error);
      throw this.handleFirebaseError(error);
    }
  }

  // Obtener token actual
  async getToken(): Promise<string | null> {
    try {
      const user = this.auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        return token;
      }
      return null;
    } catch (error) {
      console.error('Error al obtener token:', error);
      return null;
    }
  }

  // Obtener usuario actual de Firebase
  getCurrentFirebaseUser(): FirebaseUser | null {
    return this.auth.currentUser;
  }

  // Verificar si hay sesión activa
  hasActiveSession(): boolean {
    return this.auth.currentUser !== null;
  }

  // Refrescar token
  async refreshToken(): Promise<string | null> {
    try {
      const user = this.auth.currentUser;
      if (user) {
        const token = await user.getIdToken(true); // force refresh
        return token;
      }
      return null;
    } catch (error) {
      console.error('Error al refrescar token:', error);
      return null;
    }
  }

  // Manejo de errores de Firebase
  private handleFirebaseError(error: any): Error {
    const errorCode = error.code;
    
    const errorMessages: { [key: string]: string } = {
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/invalid-email': 'Correo electrónico inválido',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
      'auth/email-already-in-use': 'Este correo ya está registrado',
      'auth/weak-password': 'La contraseña es muy débil (mínimo 6 caracteres)',
      'auth/too-many-requests': 'Demasiados intentos fallidos. Por favor, intente más tarde o restablezca su contraseña',
      'auth/network-request-failed': 'Error de conexión. Verifique su internet',
      'auth/invalid-credential': 'Credenciales inválidas. Verifique su correo y contraseña',
      'auth/operation-not-allowed': 'Operación no permitida',
      'auth/requires-recent-login': 'Por seguridad, debe iniciar sesión nuevamente para realizar esta acción',
      'auth/invalid-login-credentials': 'Correo o contraseña incorrectos'
    };

    const message = errorMessages[errorCode] || `Error de autenticación: ${errorCode}`;
    const newError = new Error(message);
    (newError as any).code = errorCode;
    
    return newError;
  }
}