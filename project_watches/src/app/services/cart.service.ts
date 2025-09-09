import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CartItem {
  watchId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = '/api/cart';

  constructor(private http: HttpClient) { }

  getCart(userId: string): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/user/${userId}`);
  }

  addToCart(userId: string, watchId: string, quantity: number): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/add`, { userId, watchId, quantity });
  }

  removeFromCart(userId: string, watchId: string): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/remove/${userId}/${watchId}`);
  }

  updateItemQuantity(userId: string, watchId: string, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.apiUrl}/update`, { userId, watchId, quantity });
  }
}

