import { Route } from "@angular/router";

export const routes:Route[] = [
    {
        path: "",
        data: {
            title: "Tableau de bord"
        },
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent)
            },
            {
                path: 'users',
                loadComponent: () => import('./users-list/users-list.component').then(c => c.UsersListComponent)
            }
        ]
    }
]