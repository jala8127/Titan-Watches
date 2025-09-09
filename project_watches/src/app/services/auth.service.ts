import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isVisible = new BehaviorSubject<boolean>(false);
  isVisible$ = this.isVisible.asObservable();

  open() {
    this.isVisible.next(true);
  }

  close() {
    this.isVisible.next(false);
  }

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(user: User) {
    this.currentUserSubject.next(user);
  }

  logout() {
    this.currentUserSubject.next(null);
  }
}

