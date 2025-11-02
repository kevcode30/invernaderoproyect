// src/app/pages/welcome/welcome.page.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage {
  isAnimating = false;

  constructor(private router: Router) {}

  async goToLogin() {
    if (this.isAnimating) return;
    
    this.isAnimating = true;

    // Esperar a que termine la animación CSS
    await new Promise(resolve => setTimeout(resolve, 400));

    // Navegar después de la animación
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}