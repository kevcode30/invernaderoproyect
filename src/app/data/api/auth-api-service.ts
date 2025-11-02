import { Injectable } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  User as FirebaseUser,
  updateProfile
} from '@angular/fire/auth';

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
  constructor(private auth: Auth) {}

  // Login con Firebase
  async login(email: string, password: string): Promise<any> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth, 
        email, 
        password
      );

      const user = userCredential.user;
      
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
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        userData.email,
        userData.password
      );

      const user = userCredential.user;

      // Actualizar perfil con displayName
      await updateProfile(user, {
        displayName: userData.displayName
      });

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
      await sendPasswordResetEmail(this.auth, email);
    } catch (error: any) {
      console.error('Error al enviar email de recuperación:', error);
      throw this.handleFirebaseError(error);
    }
  }

  // Cambio de contraseña
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      const user = this.auth.currentUser;
      
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }

      // Primero reautenticar con contraseña actual
      await signInWithEmailAndPassword(
        this.auth,
        user.email!,
        currentPassword
      );

      // Luego cambiar contraseña
      await updatePassword(user, newPassword);
    } catch (error: any) {
      console.error('Error al cambiar contraseña:', error);
      throw this.handleFirebaseError(error);
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error: any) {
      console.error('Error en logout Firebase:', error);
      throw this.handleFirebaseError(error);
    }
  }

  // Obtener token actual
  async getToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }

  // Obtener usuario actual de Firebase
  getCurrentFirebaseUser(): FirebaseUser | null {
    return this.auth.currentUser;
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
      'auth/weak-password': 'La contraseña es muy débil',
      'auth/too-many-requests': 'Demasiados intentos. Intente más tarde',
      'auth/network-request-failed': 'Error de conexión. Verifique su internet',
      'auth/invalid-credential': 'Credenciales inválidas',
      'auth/operation-not-allowed': 'Operación no permitida'
    };

    const message = errorMessages[errorCode] || 'Error de autenticación';
    const newError = new Error(message);
    (newError as any).code = errorCode;
    
    return newError;
  }
}