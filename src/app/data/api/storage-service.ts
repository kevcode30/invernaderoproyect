// src/app/data/local/storage.service.ts
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  // Inicializar storage
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Guardar dato
  async set(key: string, value: any): Promise<any> {
    try {
      await this.ensureStorageReady();
      return await this._storage?.set(key, value);
    } catch (error) {
      console.error('Error al guardar en storage:', error);
      throw error;
    }
  }

  // Obtener dato
  async get(key: string): Promise<any> {
    try {
      await this.ensureStorageReady();
      return await this._storage?.get(key);
    } catch (error) {
      console.error('Error al obtener de storage:', error);
      return null;
    }
  }

  // Eliminar dato
  async remove(key: string): Promise<any> {
    try {
      await this.ensureStorageReady();
      return await this._storage?.remove(key);
    } catch (error) {
      console.error('Error al eliminar de storage:', error);
      throw error;
    }
  }

  // Limpiar todo el storage
  async clear(): Promise<void> {
    try {
      await this.ensureStorageReady();
      await this._storage?.clear();
    } catch (error) {
      console.error('Error al limpiar storage:', error);
      throw error;
    }
  }

  // Obtener todas las claves
  async keys(): Promise<string[]> {
    try {
      await this.ensureStorageReady();
      return await this._storage?.keys() || [];
    } catch (error) {
      console.error('Error al obtener claves:', error);
      return [];
    }
  }

  // Obtener cantidad de items
  async length(): Promise<number> {
    try {
      await this.ensureStorageReady();
      return await this._storage?.length() || 0;
    } catch (error) {
      console.error('Error al obtener length:', error);
      return 0;
    }
  }

  // Verificar si existe una clave
  async has(key: string): Promise<boolean> {
    try {
      const value = await this.get(key);
      return value !== null && value !== undefined;
    } catch (error) {
      return false;
    }
  }

  // Asegurar que storage está listo
  private async ensureStorageReady(): Promise<void> {
    if (!this._storage) {
      await this.init();
    }
  }
}