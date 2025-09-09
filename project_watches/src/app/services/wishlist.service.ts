import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Watch } from './watch.service'; 

export interface Wishlist {
  id: string;
  userId: string;
  watches: Watch[]; 
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = '/api/wishlist';

  constructor(private http: HttpClient) { }

  getWishlist(userId: string): Observable<Wishlist> {
    return this.http.get<Wishlist>(`${this.apiUrl}/user/${userId}`);
  }

  addToWishlist(userId: string, watchId: string): Observable<Wishlist> {
    return this.http.post<Wishlist>(`${this.apiUrl}/add`, { userId, watchId });
  }

  removeFromWishlist(userId: string, watchId: string): Observable<Wishlist> {
    return this.http.delete<Wishlist>(`${this.apiUrl}/remove/${userId}/${watchId}`);
  }
}
