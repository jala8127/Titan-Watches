import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, Cart, CartItem } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.pipe(take(1)).subscribe(currentUser => {
      if (currentUser) {
        this.loadCart(currentUser.id);
      } else {
        console.log("User is not logged in. Cannot display cart.");

        this.authService.open();
      }
    });
  }

  loadCart(userId: string): void {
    this.cartService.getCart(userId).subscribe(cartData => {
      this.cart = cartData;
    });
  }

  get isCartEmpty(): boolean {
    return !this.cart || this.cart.items.length === 0;
  }

  get cartItems(): CartItem[] {
    return this.cart?.items ?? [];
  }

  get subtotal(): number {
    if (!this.cart) return 0;
    return this.cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  get total(): number {
    return this.subtotal; 
  }

  removeItem(watchId: string): void {
    this.authService.currentUser$.pipe(take(1)).subscribe(currentUser => {
      if (currentUser) {
        this.cartService.removeFromCart(currentUser.id, watchId).subscribe(updatedCart => {
          this.cart = updatedCart;
        });
      }
    });
  }

  updateQuantity(item: CartItem): void {
    this.authService.currentUser$.pipe(take(1)).subscribe(currentUser => {
      if (currentUser && item.quantity > 0) {
        this.cartService.updateItemQuantity(currentUser.id, item.watchId, item.quantity).subscribe({
          next: updatedCart => this.cart = updatedCart,
          error: err => {
            console.error("Failed to update quantity", err);
            this.loadCart(currentUser.id); 
          }
        });
      } else if (item.quantity <= 0) {
        this.removeItem(item.watchId);
      }
    });
  }
}

