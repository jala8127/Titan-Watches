import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { WatchService, Watch } from '../services/watch.service'; 

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

  constructor(
    private route: ActivatedRoute,
    private watchService: WatchService 
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      // --- THIS IS THE FIX ---
      // Changed from params.get('mongoId') to params.get('id')
      const id = params.get('id'); 
      
      if (id) {
        this.watchService.getWatchById(id).subscribe(watchData => {
          this.watch = watchData;
          
          if (this.watch && this.watch.productImages.length > 0) {
            this.selectedImage = this.watch.productImages[0];
          }
        });
      }
    });
  }

  selectImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }
}
