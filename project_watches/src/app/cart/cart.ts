import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
export class CartComponent {
  // The cart starts empty by default
  cartItems: any[] = [];

  // This property will be true when the page first loads
  isCartEmpty = this.cartItems.length === 0;

  // Calculates the subtotal of items in the cart
  get subtotal() {
    return this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  // Calculates the final total
  get total() {
    return this.subtotal; // You can add taxes or shipping fees here later
  }

  // A function to remove an item from the cart
  removeItem(itemId: number) {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    // Update the isCartEmpty status after removing an item
    this.isCartEmpty = this.cartItems.length === 0;
  }
}

