import { Routes } from '@angular/router';

export const routes:Routes =[
  {
    path:'',
    data: {
      title: 'Payments'
    },
    children: [
      {
        path: '',
        redirectTo:'/payments/history',
        pathMatch:'full'
        
      },
      {
        path:'history',
        loadComponent:() => import('./payment-list/payment-list.component').then(c => c.PaymentListComponent),
        data:{
            title: 'History'
        }
      },
      {
        path:'transactions',
        loadComponent:() => import('./transactions/transactions.component').then(c => c.TransactionsComponent),
        data:{
            title: 'Transactions'
        }
      }
    ]
  }
]