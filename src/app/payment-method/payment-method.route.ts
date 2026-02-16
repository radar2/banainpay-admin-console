import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, Routes } from '@angular/router';


export const routes:Route[] =[
  {
    path:'',
    data: {
      title: 'Methode de paiement'
    },
    children: [
      {
        path: '',
        redirectTo:'/methods/list',
        pathMatch:'full'
        
      },
      {
        path:'list',
        loadComponent:() => import('./payment-method-list/payment-method-list.component').then(c => c.PaymentMethodListComponent)
      },
      {
        path:':p1/configuration',
        loadComponent:() => import('./payment-method-config/payment-method-config.component').then(c => c.PaymentMethodConfigComponent), 
        // children: [
        //   {
        //     path: 'wave',
        //     loadComponent: () => import('./payment-method-config/wave/wave.component').then(c => c.WaveComponent)
        //   },
        //   {
        //     path: 'orange',
        //     loadComponent: () => import('./payment-method-config/orange/orange.component').then(c => c.OrangeComponent)
        //   },
        //   {
        //     path: 'moov',
        //     loadComponent: () => import('./payment-method-config/moov/moov.component').then(c => c.MoovComponent)
        //   },
        //   {
        //     path: 'momo',
        //     loadComponent: () => import('./payment-method-config/momo/momo.component').then(c => c.MomoComponent)
        //   }
        // ]

      }
    ]
  }
]
