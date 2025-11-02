// src/app/domain/models/user.model.ts

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  TECHNICIAN = 'technician'
}

export interface IUser {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  role: UserRole;
  photoURL?: string;
  createdAt: Date;
  updatedAt?: Date;
  lastLogin?: Date;
  preferences?: UserPreferences;
  greenhouseIds?: string[]; // RF.18 - Acceso multiinvernadero
}

export interface UserPreferences {
  // RF.6 - Configuración de preferencias
  language: 'es' | 'en';
  units: 'metric' | 'imperial';
  notifications: {
    push: boolean;      // RF.41
    email: boolean;     // RF.90
    sms: boolean;       // RF.22
  };
  theme: 'light' | 'dark' | 'auto'; // RF.51
}

export class User implements IUser {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  role: UserRole;
  photoURL?: string;
  createdAt: Date;
  updatedAt?: Date;
  lastLogin?: Date;
  preferences?: UserPreferences;
  greenhouseIds?: string[];

  constructor(data: IUser) {
    this.uid = data.uid;
    this.email = data.email;
    this.displayName = data.displayName;
    this.phoneNumber = data.phoneNumber;
    this.role = data.role;
    this.photoURL = data.photoURL;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.lastLogin = data.lastLogin;
    this.preferences = data.preferences || this.getDefaultPreferences();
    this.greenhouseIds = data.greenhouseIds || [];
  }

  // Métodos de lógica de negocio
  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  isTechnician(): boolean {
    return this.role === UserRole.TECHNICIAN;
  }

  canManageUsers(): boolean {
    // RF.23, RF.24, RF.25 - Gestión de usuarios
    return this.isAdmin();
  }

  hasAccessToGreenhouse(greenhouseId: string): boolean {
    // RF.18 - Verificar acceso a invernadero específico
    return this.greenhouseIds?.includes(greenhouseId) || false;
  }

  getDisplayName(): string {
    return this.displayName || this.email.split('@')[0];
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      language: 'es',
      units: 'metric',
      notifications: {
        push: true,
        email: true,
        sms: false
      },
      theme: 'auto'
    };
  }

  // Actualizar última fecha de acceso
  updateLastLogin(): void {
    this.lastLogin = new Date();
  }

  // Serializar para guardar en BD
  toJSON(): any {
    return {
      uid: this.uid,
      email: this.email,
      displayName: this.displayName,
      phoneNumber: this.phoneNumber,
      role: this.role,
      photoURL: this.photoURL,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt?.toISOString(),
      lastLogin: this.lastLogin?.toISOString(),
      preferences: this.preferences,
      greenhouseIds: this.greenhouseIds
    };
  }

  // Crear desde JSON
  static fromJSON(json: any): User {
    return new User({
      uid: json.uid,
      email: json.email,
      displayName: json.displayName,
      phoneNumber: json.phoneNumber,
      role: json.role,
      photoURL: json.photoURL,
      createdAt: new Date(json.createdAt),
      updatedAt: json.updatedAt ? new Date(json.updatedAt) : undefined,
      lastLogin: json.lastLogin ? new Date(json.lastLogin) : undefined,
      preferences: json.preferences,
      greenhouseIds: json.greenhouseIds
    });
  }
}