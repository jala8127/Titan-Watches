import { Component, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service'; 
import { Auth } from '../auth/auth'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Auth 
  ],
  templateUrl: './dashboard.html', 
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  isAccountDropdownOpen = false;

  constructor(private elementRef: ElementRef, private authService: AuthService) {}

  toggleAccountDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.isAccountDropdownOpen = !this.isAccountDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const dropdownWrapper = this.elementRef.nativeElement.querySelector('.action-item-wrapper');
    if (dropdownWrapper && !dropdownWrapper.contains(event.target)) {
      this.isAccountDropdownOpen = false;
    }
  }

  openAuthModal() {
    this.isAccountDropdownOpen = false; 
    this.authService.open(); 
  }

  logout() {
    this.isAccountDropdownOpen = false;
    console.log('Logout action triggered');
  }
}

