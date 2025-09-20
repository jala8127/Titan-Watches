import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Watch {
  mongoId: string;
  id: number;
  gender: 'Men' | 'Women';
  brand: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  imageUrl: string;
  isBestSeller: boolean;
  modelNumber: string;
  description: string;
  features: string[];
  productImages: string[];
}

@Injectable({
  providedIn: 'root'
})
export class WatchService {
  private apiUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) { }

  getWatches(): Observable<Watch[]> {
    return this.http.get<Watch[]>(this.apiUrl);
  }

  getWatchById(id: string): Observable<Watch> {
    return this.http.get<Watch>(`${this.apiUrl}/${id}`);
  }
}