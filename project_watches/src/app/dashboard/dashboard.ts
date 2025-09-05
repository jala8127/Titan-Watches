import { Component, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './dashboard.html', 
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  isAccountDropdownOpen = false;

  constructor(private elementRef: ElementRef, private router: Router) {}

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

  navigateToLogin() {
    this.isAccountDropdownOpen = false;
    this.router.navigate(['/login']);
  }
}

