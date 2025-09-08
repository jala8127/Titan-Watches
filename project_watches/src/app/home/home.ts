import { Component, OnInit, OnDestroy, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  carouselImages = [
    { src: 'assets/coursel/home1.webp', alt: 'Carousel Image 1'},
    { src: 'assets/coursel/home2.webp', alt: 'Carousel Image 2'},
    { src: 'assets/coursel/home3.webp', alt: 'Carousel Image 3'},
    { src: 'assets/coursel/home4.webp', alt: 'Carousel Image 4'},
    { src: 'assets/coursel/home5.webp', alt: 'Carousel Image 5'},
    { src: 'assets/coursel/home6.webp', alt: 'Carousel Image 6'},
    { src: 'assets/coursel/home7.webp', alt: 'Carousel Image 7'},
    { src: 'assets/coursel/home8.webp', alt: 'Carousel Image 8'}
  ];
  displayImages: any[] = [];
  currentIndex = 1;
  transitionEnabled = true;
  private intervalId: any;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.setupCarousel();
    this.startAutoScroll();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
        this.ngZone.runOutsideAngular(() => {
            this.initWatchScrollAnimation();
        });
    }, 100);
  }

  ngOnDestroy(): void {
    this.stopAutoScroll();
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }

  setupCarousel(): void {
    if (this.carouselImages.length > 0) {
      const firstClone = { ...this.carouselImages[0] };
      const lastClone = { ...this.carouselImages[this.carouselImages.length - 1] };
      this.displayImages = [lastClone, ...this.carouselImages, firstClone];
    }
  }

  startAutoScroll(): void {
    this.stopAutoScroll();
    this.ngZone.runOutsideAngular(() => {
        this.intervalId = setInterval(() => {
            this.ngZone.run(() => {
                this.goToNextSlide(false);
            });
        }, 3000);
    });
  }

  stopAutoScroll(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Helper to restart the timer after a manual click
  restartAutoScroll(): void {
      this.stopAutoScroll();
      this.startAutoScroll();
  }

  goToNextSlide(manual = true): void {
    if (this.currentIndex >= this.displayImages.length - 1) return;
    this.transitionEnabled = true;
    this.currentIndex++;
    if (manual) {
        this.restartAutoScroll();
    }
  }

  goToPrevSlide(): void {
    if (this.currentIndex <= 0) return;
    this.transitionEnabled = true;
    this.currentIndex--;
    this.restartAutoScroll();
  }

  goToSlide(index: number): void {
    this.transitionEnabled = true;
    this.currentIndex = index + 1;
    this.restartAutoScroll();
  }

  handleTransitionEnd(): void {
    if (this.currentIndex === 0) {
      this.transitionEnabled = false;
      this.currentIndex = this.displayImages.length - 2;
    }

    if (this.currentIndex >= this.displayImages.length - 1) {
      this.transitionEnabled = false;
      this.currentIndex = 1;
    }
  }

  // --- GSAP Scroll Animation Method ---
  private initWatchScrollAnimation(): void {
    gsap.registerPlugin(ScrollTrigger);

    const canvas = document.getElementById('watch-canvas') as HTMLCanvasElement;
    if (!canvas) { return; }

    const context = canvas.getContext('2d');
    if (!context) { return; }

    canvas.width = 1158;
    canvas.height = 770;

    const frameCount = 180;
    const currentFrame = (index: number) => (
      `assets/scroll/${(index + 1).toString().padStart(3, '0')}.jpg`
    );

    const images: HTMLImageElement[] = [];
    const watch = { frame: 0 };

    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
    }

    Promise.all(images.map(img => new Promise(resolve => img.onload = resolve))).then(() => {
        setupAnimation();
    });

    const render = () => {
      if (images[watch.frame] && images[watch.frame].complete) {
        const scale = Math.min(canvas.width / images[watch.frame].width, canvas.height / images[watch.frame].height);
        const x = (canvas.width / 2) - (images[watch.frame].width / 2) * scale;
        const y = (canvas.height / 2) - (images[watch.frame].height / 2) * scale;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(images[watch.frame], x, y, images[watch.frame].width * scale, images[watch.frame].height * scale);
      }
    }

    const setupAnimation = () => {
        render(); // Initial render

        const tl = gsap.timeline({
            scrollTrigger: {
                scroller: ".home-container",
                trigger: ".scroll-sequence-container",
                pin: true,
                // --- UPDATED VALUES ---
                scrub: 2.5, // Increased for a smoother effect
                start: "top top",
                end: "+=1000%", // Significantly increased to slow down the animation
                // --- END OF UPDATES ---
            },
        });

        tl.to(watch, {
            frame: frameCount - 1,
            snap: "frame",
            ease: "none",
            duration: 1,
            onUpdate: render,
        });

        tl.fromTo("#section-1 .text-content", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }, '0.2');
        tl.to("#section-1 .text-content", { opacity: 0, y: -50, duration: 0.2, ease: "power2.in" }, '0.4');

        tl.fromTo("#section-2 .text-content", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }, '0.5');
        tl.to("#section-2 .text-content", { opacity: 0, y: -50, duration: 0.2, ease: "power2.in" }, '0.7');

        tl.fromTo("#section-3 .text-content", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }, '0.8');
        tl.to("#section-3 .text-content", { opacity: 0, y: -50, duration: 0.2, ease: "power2.in" }, '1');
    }
  }
}


