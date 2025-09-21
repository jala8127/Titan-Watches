import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * A functional route guard to protect routes that require authentication.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if a user is currently logged in.
  if (authService.currentUserValue) {
    // If logged in, allow access to the route.
    return true;
  }

  // --- IMPROVED LOGIC ---
  // If the user is not logged in:
  // 1. Open the authentication modal to prompt them to log in.
  authService.open();
  
  // 2. Block the navigation to the protected route (like /profile or /orders).
  // The user will stay on the current page and see the login modal.
  return false;
};

