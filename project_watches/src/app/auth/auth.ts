import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class Auth implements OnDestroy {
  isVisible = false;
  isLoginView = true;
  private subscription: Subscription;

  identifier: string = '';
  otp: string = '';
  isOtpSent: boolean = false;
  user = { name: '', email: '', phoneNumber: '' };
  message: string | null = null;
  isError: boolean = false;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.subscription = this.authService.isVisible$.subscribe(
      (visible) => {
        this.isVisible = visible;
        if (visible) {
          this.resetForms();
        }
      }
    );
  }


  closeModal() {
    this.authService.close();
  }
  
  toggleView() {
    this.isLoginView = !this.isLoginView;
    this.resetForms();
  }

  private resetForms() {
    this.isOtpSent = false;
    this.identifier = '';
    this.otp = '';
    this.user = { name: '', email: '', phoneNumber: '' };
    this.message = null;
    this.isError = false;
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  requestOtp(form: NgForm) {
    if (form.invalid) return;
    this.http.post('/api/auth/login/request', { identifier: this.identifier }, { responseType: 'text' }).subscribe({
      next: (response) => {
        this.isOtpSent = true;
        this.isError = false;
        this.message = response;
      },
      error: (err) => {
        this.isError = true;
        this.message = err.error || 'User not found.';
      }
    });
  }

  verifyOtp(form: NgForm) {
    if (form.invalid) return;
    this.http.post('/api/auth/login/verify', { identifier: this.identifier, otp: this.otp }, { responseType: 'text' }).subscribe({
      next: (response) => {
        this.isError = false;
        this.message = response;
        setTimeout(() => this.closeModal(), 1500);
      },
      error: (err) => {
        this.isError = true;
        this.message = err.error || 'An error occurred during verification.';
      }
    });
  }

  onSignupSubmit(form: NgForm) {
    if (form.invalid) return;
    this.http.post('/api/auth/register', this.user, { responseType: 'text' }).subscribe({
      next: (response) => {
        this.isError = false;
        this.message = response + ' Please log in.';
        setTimeout(() => this.toggleView(), 1500);
      },
      error: (err) => {
        this.isError = true;
        this.message = err.error || 'An unexpected error occurred.';
      }
    });
  }
}
