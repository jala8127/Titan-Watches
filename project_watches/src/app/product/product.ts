import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { WatchService, Watch } from '../services/watch.service'; 
import { CartService } from '../services/cart.service';
import { WishlistService } from '../services/wishlist.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product.html',
  styleUrl: './product.css'
})
export class Product implements OnInit {
  watch: Watch | undefined;
  selectedImage: string | undefined;
  feedbackMessage: string | null = null;
  isInWishlist = false;

  constructor(
    private route: ActivatedRoute,
    private watchService: WatchService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id'); 
      if (id) {
        this.watchService.getWatchById(id).subscribe(watchData => {
          this.watch = watchData;
          if (this.watch && this.watch.productImages.length > 0) {
            this.selectedImage = this.watch.productImages[0];
          }
          this.checkIfInWishlist();
        });
      }
    });
  }

  selectImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }

  addToCart(): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      this.authService.open(); 
      return;
    }
    if (this.watch) {
      this.cartService.addToCart(currentUser.id, this.watch.mongoId, 1).subscribe({
        next: () => {
          this.showFeedback('Added to cart successfully!');
        },
        error: () => {
          this.showFeedback('Failed to add to cart.');
        }
      });
    }
  }

  toggleWishlist(): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      this.authService.open();
      return;
    }
    if (this.watch) {
      if (this.isInWishlist) {
        this.wishlistService.removeFromWishlist(currentUser.id, this.watch.mongoId).subscribe(() => {
          this.isInWishlist = false;
          this.showFeedback('Removed from wishlist.');
        });
      } else {
        this.wishlistService.addToWishlist(currentUser.id, this.watch.mongoId).subscribe(() => {
          this.isInWishlist = true;
          this.showFeedback('Added to wishlist!');
        });
      }
    }
  }

  checkIfInWishlist(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && this.watch) {
      this.wishlistService.getWishlist(currentUser.id).subscribe(wishlist => {
        this.isInWishlist = wishlist.watches.some(w => w.mongoId === this.watch?.mongoId);
      });
    }
  }

  showFeedback(message: string): void {
    this.feedbackMessage = message;
    setTimeout(() => this.feedbackMessage = null, 3000);
  }
}
