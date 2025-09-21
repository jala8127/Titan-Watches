import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Import RouterModule

// Define an interface for what an order item looks like
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

// Define an interface for a complete order
interface Order {
  id: string;
  orderDate: string;
  status: 'Delivered' | 'Processing' | 'Shipped' | 'Cancelled';
  total: number;
  items: OrderItem[];
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule], // Add RouterModule here
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class Orders implements OnInit {
  orders: Order[] = [];
  isLoading = true;

  constructor() { }

  ngOnInit(): void {
    // Simulate checking for orders from a backend API
    this.fetchOrders();
  }

  fetchOrders() {
    this.isLoading = true;
    // Simulate an API call delay
    setTimeout(() => {
      // In a real application, this is where you would get orders from your API.
      // For now, we will keep the array empty to show the "no orders" message.
      this.orders = [];
      this.isLoading = false;
    }, 1000); // 1 second delay
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'Delivered': return 'status-delivered';
      case 'Processing': return 'status-processing';
      case 'Shipped': return 'status-shipped';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  }
}

