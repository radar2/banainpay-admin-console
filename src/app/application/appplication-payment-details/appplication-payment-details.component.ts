import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-appplication-payment-details',
  templateUrl: './appplication-payment-details.component.html',
  styleUrls: ['./appplication-payment-details.component.scss']
})
export class AppplicationPaymentDetailsComponent implements OnInit {
  paymentId: string | null = null;
  payment: any;

  mockPayment = {
    id: 'pi_1HrQ7z2eZvKYlo2Cuvx6nl0X',
    amount: 1200,
    currency: 'EUR',
    status: 'Succeeded',
    method: 'Visa **** 4242',
    date: '2026-01-12T15:24:00',
    customer: 'Jean Dupont',
    receipt_url: '#',
    description: 'Facture d’abonnement Premium (Stripe style)'
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.paymentId = this.route.snapshot.paramMap.get('id');
    // Ici, on branchera l’appel API plus tard. Pour l’instant, on affiche la maquette.
    this.payment = this.mockPayment;
  }
}
