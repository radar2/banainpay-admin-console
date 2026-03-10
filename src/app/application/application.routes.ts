
import {Route, RouterModule} from '@angular/router';

export const routes:Route[] = [

  {
    path:'',
    data : {
      title:'Applications'
    },
    children:[
      {
        path: '',
        redirectTo:'/applications/list',
        pathMatch:'full'
      },
      {
        path: ':p1/:p2/list',
        loadComponent:() =>import('./appplication-list/appplication-list.component').then(c => c.AppplicationListComponent), 
        data: {
         title:  "Liste"
        }
      },
      {
            path:'payments',
            loadComponent:() => import('./appplication-payment-history/appplication-payment-history.component').then(m => m.AppplicationPaymentHistoryComponent)
      },
      {
        path: 'details/:p1',
        loadComponent:() =>import('./appplication-details/appplication-details.component').then(c => c.AppplicationDetailsComponent),
        data: {
         title:  "detials"
        },
        children:[
          {
            path:'',
            redirectTo:'/applications/details/:p1/payments',
            pathMatch:"full"
          },
          {
            path:'infos',
            loadComponent:() => import('./application-gemeral/application-gemeral.component').then(m => m.ApplicationGemeralComponent)
          },
          {
            path:'payment-methods',
            loadComponent:() => import('./appplication-payment-method/appplication-payment-method.component').then(m => m.AppplicationPaymentMethodComponent)
          },

          {
            path:'payments',
            loadComponent:() => import('./appplication-payment-history/appplication-payment-history.component').then(m => m.AppplicationPaymentHistoryComponent)
          },
          {
            path:'transactions',
            loadComponent:() => import('./appplication-wallet/appplication-wallet.component').then(c => c.AppplicationWalletComponent),
            data: {
              title: 'Transactions'
            }
          }
      
        ]
      },
      {
        path: 'new',
        loadComponent:() =>import('./appplication-add/appplication-add.component').then(c => c.AppplicationAddComponent), 
        data: {
         title:  "Register"
        }
      }
    ]
  }
      
]


