import { Route } from "@angular/router";
import { title } from "process";
import { canActiveAuthRoles } from "../guard/auth-role.guard";

export const routes:Route[] = [
     {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent),
        canActivate: [canActiveAuthRoles],
        data: {
            title: 'Tableau de bord',
            role: ['Merchant']
        }
    },
    {
        path: 'users',
        loadComponent: () => import('./users-list/users-list.component').then(c => c.UsersListComponent),

    }
]