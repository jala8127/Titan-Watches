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
  cartItems = [
    {
      id: 1,
      name: 'Titan Quartz Analog Watch',
      price: 2595,
      quantity: 1,
      imageUrl: 'https://via.placeholder.com/100'
    },
    {
      id: 2,
      name: 'Raga Delight Gold Watch',
      price: 6595,
      quantity: 1,
      imageUrl: 'https://via.placeholder.com/100'
    }
  ];

  isCartEmpty = this.cartItems.length === 0;

  get subtotal() {
    return this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  get total() {
    return this.subtotal;
  }
}
