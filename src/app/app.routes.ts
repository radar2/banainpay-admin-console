import { Routes } from '@angular/router';
import { canActiveAuthRoles } from './guard/auth-role.guard';
import { redirectRoleGuard } from './guard/redirect-role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/merchands/dashboard',
    pathMatch: 'full'
  },
 
  {
    path: '',
    loadComponent: () => import('./layout').then(m => m.DefaultLayoutComponent),
    data: {
      title: 'Home'
    },
    children: [
      {
        path: '',
        redirectTo: '/merchands/dashboard',
        pathMatch: 'full'
      },
       {
        path:'empty',
        loadComponent: () => import('./empty/empty.component').then(c => c.EmptyComponent)
      },
      {
        path:'payments',
        loadComponent:() => import('./payments/payment-list/payment-list.component').then(c => c.PaymentListComponent),
        canActivate: [canActiveAuthRoles],
        data: {title:'Paiments', role: ['Administrator', 'Merchand'],}
      },
      {
        path:'transactions',
        loadComponent:() => import('./payments/transactions/transactions.component').then(m => m.TransactionsComponent),
        canActivate: [canActiveAuthRoles],
        data: {title:'Transactions', role: ['Administrator', 'Merchand'],}
      },
      {
        path:'applications',
        loadChildren:() => import('./application/application.routes').then(m => m.routes),
        canActivate: [canActiveAuthRoles],
        data: {role: ['Administrator', 'Merchand'],}
      },
      {
        path:'methods',
        loadChildren:() => import('./payment-method/payment-method.route').then(m =>m.routes),
        canActivate: [canActiveAuthRoles],
        data: {role: ['Administrator']}
      },
      {
        path:'merchands',
        loadChildren:() => import('./merchands/merchands.routes').then(m => m.routes),
        
      },
      
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes),
        canActivate: [canActiveAuthRoles],
        data: {role: ['Administrator']}
      },
      {
        path: '404',
        loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
        data: {
          title: 'Page 404'
        }
      },
      {
        path: '403',
        loadComponent: () => import('./errors/page403/page403.component').then(m => m.Page403Component),
        data: {
          title: 'Page 403'
        }
      },
      {
        path: 'theme',
        loadChildren: () => import('./views/theme/routes').then((m) => m.routes)
      },
      {
        path: 'base',
        loadChildren: () => import('./views/base/routes').then((m) => m.routes)
      },
      {
        path: 'buttons',
        loadChildren: () => import('./views/buttons/routes').then((m) => m.routes)
      },
      {
        path: 'forms',
        loadChildren: () => import('./views/forms/routes').then((m) => m.routes)
      },
      {
        path: 'icons',
        loadChildren: () => import('./views/icons/routes').then((m) => m.routes)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./views/notifications/routes').then((m) => m.routes)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/routes').then((m) => m.routes)
      },
      {
        path: 'charts',
        loadChildren: () => import('./views/charts/routes').then((m) => m.routes)
      },
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/routes').then((m) => m.routes)
      }
    ]
  },
  
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },
  { path: '**', redirectTo: 'empty' }
];
