import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { AuthService, User } from '../services/auth.service';
import { environment } from '../../enviroments/environment';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class Auth implements OnDestroy {
  // --- STATE MANAGEMENT ---
  isVisible = false;
  isLoginView = true;
  private subscription: Subscription;
  identifier: string = '';
  isLoginOtpSent: boolean = false;
  user = { name: '', email: '', phoneNumber: '' };
  isRegistrationOtpSent: boolean = false;
  otp: string = '';
  message: string | null = null;
  isError: boolean = false;
  isLoading: boolean = false; // <-- NEW: For loading indicators

  private apiUrl = environment.apiUrl; 

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

  closeModal() { this.authService.close(); }
  toggleView() { this.isLoginView = !this.isLoginView; this.resetForms(); }

  private resetForms() {
    this.isLoginOtpSent = false;
    this.isRegistrationOtpSent = false;
    this.identifier = '';
    this.otp = '';
    this.user = { name: '', email: '', phoneNumber: '' };
    this.message = null;
    this.isError = false;
    this.isLoading = false;
  }
  
  ngOnDestroy() { this.subscription.unsubscribe(); }

  requestRegistrationOtp(form: NgForm) {
    if (form.invalid || this.isLoading) return;
    const apiCall = this.http.post(`${this.apiUrl}/api/auth/register/request`, this.user, { responseType: 'text' });
    
    this.handleApiCall(apiCall, (response) => {
      this.isRegistrationOtpSent = true;
      this.message = response;
    }, 'Registration failed. The email may already be in use.');
  }

  verifyRegistrationOtp(form: NgForm) {
    if (form.invalid || this.isLoading) return;
    const payload = { email: this.user.email, otp: this.otp };
    const apiCall = this.http.post<User>(`${this.apiUrl}/api/auth/register/verify`, payload);

    this.handleApiCall(apiCall, (createdUser) => {
      this.message = "Account created successfully! Please log in.";
      setTimeout(() => this.toggleView(), 2000);
    }, 'Verification failed.');
  }

  requestLoginOtp(form: NgForm) {
    if (form.invalid || this.isLoading) return;
    const apiCall = this.http.post(`${this.apiUrl}/api/auth/login/request`, { identifier: this.identifier }, { responseType: 'text' });
    
    this.handleApiCall(apiCall, (response) => {
      this.isLoginOtpSent = true;
      this.message = response;
    }, 'No account found with this email or phone number.');
  }

  verifyLoginOtp(form: NgForm) {
    if (form.invalid || this.isLoading) return;
    const payload = { identifier: this.identifier, otp: this.otp };
    const apiCall = this.http.post<User>(`${this.apiUrl}/api/auth/login/verify`, payload);

    this.handleApiCall(apiCall, (loggedInUser) => {
      this.message = "Login Successful!";
      this.authService.login(loggedInUser);
      setTimeout(() => this.closeModal(), 1500);
    }, 'Verification failed. Please check the code and try again.');
  }

  /**
   * NEW: A centralized handler for API calls to reduce code duplication.
   * It manages loading state, success, and error handling.
   */
  private handleApiCall<T>(apiCall: Observable<T>, successCallback: (response: T) => void, defaultErrorMessage: string) {
    this.isLoading = true;
    this.isError = false;
    this.message = null;

    apiCall.pipe(
      finalize(() => this.isLoading = false) // Ensure loading is turned off after call completes or errors
    ).subscribe({
      next: (response) => {
        this.isError = false;
        successCallback(response);
      },
      error: (err: HttpErrorResponse) => {
        this.isError = true;
        // The backend now sends plain text errors, so we access them via `err.error`
        this.message = err.error || defaultErrorMessage;
      }
    });
  }
}
