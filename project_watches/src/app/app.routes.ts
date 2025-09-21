import { Routes } from '@angular/router';
import { authGuard } from './gaurds/auth.gaurd';


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
            },
            {
                path: 'profile',
                loadComponent: () => import('./profile/profile').then(m => m.ProfileComponent),
                canActivate: [authGuard] 
            },
            // --- NEW ORDERS ROUTE ---
            {
                path: 'orders',
                // Assuming your component is located at '../components/orders/orders.component'
                loadComponent: () => import('./orders/orders').then(m => m.Orders),
                canActivate: [authGuard] // Protect this route with the same guard
            }
        ]
    }
];

