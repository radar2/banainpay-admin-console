import { Routes } from "@angular/router";

export const routes:Routes = [
    {
        path: '',
        redirectTo: '/merchands/list',
        pathMatch: 'full'
    },
    {
        path:'list',
        loadComponent: () => import('./merchand-list/merchand-list.component').then(c =>c.MerchandListComponent)
    },
    {
        path:'regiter',
        loadComponent: () => import('./merchand-register/merchand-register.component').then(c =>c.MerchandRegisterComponent)
    }
]