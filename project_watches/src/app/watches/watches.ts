import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Params } from '@angular/router';
import { WatchService, Watch } from '../services/watch.service'; 

@Component({
  selector: 'app-watches',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './watches.html', 
  styleUrl: './watches.css'
})
export class Watches implements OnInit {
  activeGender: string | null = null;
  activeColor: string | null = null;
  maxPrice: number = 10000;
  
  private allWatches: Watch[] = []; 
  filteredWatches: Watch[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private watchService: WatchService 
  ) {}

  ngOnInit(): void {
    this.watchService.getWatches().subscribe(watches => {
      // --- DEBUGGING STEP ---
      // This will show you exactly what the service is returning.
      // Open your browser's developer console (F12) to see this message.
      console.log('Data received from WatchService:', watches);

      this.allWatches = watches; 

      this.route.queryParams.subscribe((params: Params) => {
        this.activeGender = params['gender'] || null;
        this.applyFilters();
      });
    });
  }

  applyFilters(): void {
    let watchesToProcess = [...this.allWatches];

    if (this.activeGender) {
      watchesToProcess = watchesToProcess.filter(watch => watch.gender === this.activeGender);
    }
    
    this.shuffleArray(watchesToProcess);

    if (this.activeColor) {
      watchesToProcess = watchesToProcess.filter(watch => 
        watch.name.toLowerCase().includes(this.activeColor!.toLowerCase())
      );
    }
    watchesToProcess = watchesToProcess.filter(watch => watch.price <= this.maxPrice);

    this.filteredWatches = watchesToProcess;
  }

  private shuffleArray(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  setColorFilter(color: string): void {
    this.activeColor = this.activeColor === color ? null : color;
    this.applyFilters();
  }

  setPriceFilter(event: any): void {
    this.maxPrice = Number(event.target.value);
    this.applyFilters();
  }

  clearAllFilters(): void {
    this.activeColor = null;
    this.maxPrice = 10000;
    this.applyFilters();
  }
}

