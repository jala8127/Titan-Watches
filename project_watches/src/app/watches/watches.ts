import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// FIX: Corrected the import path from '@angular_router' to '@angular/router'
import { ActivatedRoute, RouterLink, Params } from '@angular/router';
import { Watch, WATCHES } from '../data/watches.data';

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
  
  filteredWatches: Watch[] = [];
  
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // FIX: Added the 'Params' type to the callback parameter
    this.route.queryParams.subscribe((params: Params) => {
      this.activeGender = params['gender'] || null;
      this.applyFilters();
    });
  }

  /**
   * Applies all active filters to the watch list.
   * Now shuffles the list for all collections.
   */
  applyFilters(): void {
    let watchesToProcess = [...WATCHES];

    // 1. First, filter by gender if one is selected.
    if (this.activeGender) {
      watchesToProcess = watchesToProcess.filter(watch => watch.gender === this.activeGender);
    }

    // 2. ALWAYS shuffle the resulting list (either all watches, or the filtered gender list).
    this.shuffleArray(watchesToProcess);

    // 3. Then, apply the other active filters to the shuffled list.
    if (this.activeColor) {
      watchesToProcess = watchesToProcess.filter(watch => 
        watch.name.toLowerCase().includes(this.activeColor!.toLowerCase())
      );
    }
    watchesToProcess = watchesToProcess.filter(watch => watch.price <= this.maxPrice);

    // 4. Update the final list that gets displayed.
    this.filteredWatches = watchesToProcess;
  }

  /**
   * Shuffles an array in place using the Fisher-Yates algorithm.
   */
  private shuffleArray(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // --- Methods for the filter sidebar ---

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
