import { Routes } from "@angular/router";
import { canActiveAuthRoles } from "../guard/auth-role.guard";

export const routes:Routes = [
    {
        path:'',
        data: {title: 'Marchands'},
        children: [
            {
                path: '',
                redirectTo: '/merchands/list',
                pathMatch: 'full'
            },
            {
                path:'list',
                loadComponent: () => import('./merchand-list/merchand-list.component').then(c =>c.MerchandListComponent),
                data: {title: 'Liste', role: ['Administrator']},
                canActivate: [canActiveAuthRoles],
            },
            {
                path:'regiter',
                loadComponent: () => import('./merchand-register/merchand-register.component').then(c =>c.MerchandRegisterComponent),
                data: {title: 'enregistrement', role: ['Administrator']},
                canActivate: [canActiveAuthRoles],
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./merchant-dashboard/merchant-dashboard.component').then(c => c.merchantDashboardComponent), 
                data: {
                    title: 'Tableau de bord', 
                    role: ['Merchant']
                }, 
                canActivate: [canActiveAuthRoles],

            }
        ]
    }
]