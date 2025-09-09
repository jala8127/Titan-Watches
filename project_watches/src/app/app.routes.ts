import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./dashboard/dashboard').then(m => m.DashboardComponent),
        children: [
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            },
            {
                path: 'login',
                redirectTo: 'home',
                pathMatch: 'full'
            },
            {
                path: 'home',
                loadComponent: () => import('./home/home').then(m => m.HomeComponent)
            },
            {
                path: 'watches',
                loadComponent: () => import('./watches/watches').then(m => m.Watches)
            },
            {
                path: 'watch/:id',
                loadComponent: () => import('./product/product').then(m => m.Product)
            },
            {
                path: 'cart',
                loadComponent: () => import('./cart/cart').then(m => m.CartComponent)
            },
            {
                path: 'wishlist',
                loadComponent: () => import('./wishlist/wishlist').then(m => m.WishlistComponent)
            }
        ]
    }
];

