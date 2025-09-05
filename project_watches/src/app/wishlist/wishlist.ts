import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.css']
})
export class WishlistComponent {

  wishlistItems = [
    {
      id: 3,
      name: 'Titan Men\'s Elegance Watch',
      price: 1995,
      imageUrl: 'https://via.placeholder.com/250' 
    },
    {
      id: 4,
      name: 'Tommy Hilfiger Blue Dial',
      price: 8395,
      imageUrl: 'https://via.placeholder.com/250' 
    }
  ];

  isWishlistEmpty = this.wishlistItems.length === 0;
}