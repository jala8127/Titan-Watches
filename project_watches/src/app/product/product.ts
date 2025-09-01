import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { WATCHES, Watch } from '../data/watches.data';

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

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.watch = WATCHES.find(w => w.id === +id);
        
        if (this.watch && this.watch.productImages.length > 0) {
          this.selectedImage = this.watch.productImages[0];
        } else {
          // Handle case where watch is found but has no images, if necessary
        }
      }
    });
  }

  selectImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }
}
