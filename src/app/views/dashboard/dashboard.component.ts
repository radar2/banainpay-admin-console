import { Component, DestroyRef, DOCUMENT, effect, inject, OnInit, Renderer2, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChartOptions, Chart, ChartData, ChartType } from 'chart.js';
import {BaseChartDirective} from 'ng2-charts'
import {
  AvatarComponent,
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  FormCheckLabelDirective,
  GutterDirective,
  ProgressComponent,
  RowComponent,
  TableDirective
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';

import { WidgetsBrandComponent } from '../widgets/widgets-brand/widgets-brand.component';
import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';
import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
import { PaymentListComponent } from '../../payments/payment-list/payment-list.component';
import { RouterModule } from '@angular/router';
import { PaymentService } from '../../payments/payment.service';
import {MoneyUtility} from '../../utility/money.utility';
import { AnalyticsService } from '../../services/analytics.service';
import { CommonModule, formatNumber } from '@angular/common';
import { getPaymentMethodLogo } from '../../utility/utility';

interface IUser {
  name: string;
  state: string;
  registered: string;
  country: string;
  usage: number;
  period: string;
  payment: string;
  activity: string;
  avatar: string;
  status: string;
  color: string;
}

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  imports: [WidgetsDropdownComponent,BaseChartDirective, CommonModule, RouterModule, PaymentListComponent, CardComponent, CardBodyComponent, RowComponent, ColComponent, ButtonDirective, IconDirective, ReactiveFormsModule, ButtonGroupComponent, FormCheckLabelDirective, ChartjsComponent, CardFooterComponent, GutterDirective, ProgressComponent, WidgetsBrandComponent, CardHeaderComponent, TableDirective, AvatarComponent]
})
export class DashboardComponent implements OnInit {
  paymentService = inject(PaymentService);
  analyticsService = inject(AnalyticsService);

  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #document: Document = inject(DOCUMENT);
  readonly #renderer: Renderer2 = inject(Renderer2);
  readonly #chartsData: DashboardChartsData = inject(DashboardChartsData);

  public users: IUser[] = [
    {
      name: 'Yiorgos Avraamu',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Us',
      usage: 50,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Mastercard',
      activity: '10 sec ago',
      avatar: './assets/images/avatars/1.jpg',
      status: 'success',
      color: 'success'
    },
    {
      name: 'Avram Tarasios',
      state: 'Recurring ',
      registered: 'Jan 1, 2021',
      country: 'Br',
      usage: 10,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Visa',
      activity: '5 minutes ago',
      avatar: './assets/images/avatars/2.jpg',
      status: 'danger',
      color: 'info'
    },
    {
      name: 'Quintin Ed',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'In',
      usage: 74,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Stripe',
      activity: '1 hour ago',
      avatar: './assets/images/avatars/3.jpg',
      status: 'warning',
      color: 'warning'
    },
    {
      name: 'Enéas Kwadwo',
      state: 'Sleep',
      registered: 'Jan 1, 2021',
      country: 'Fr',
      usage: 98,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Paypal',
      activity: 'Last month',
      avatar: './assets/images/avatars/4.jpg',
      status: 'secondary',
      color: 'danger'
    },
    {
      name: 'Agapetus Tadeáš',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Es',
      usage: 22,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'ApplePay',
      activity: 'Last week',
      avatar: './assets/images/avatars/5.jpg',
      status: 'success',
      color: 'primary'
    },
    {
      name: 'Friderik Dávid',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Pl',
      usage: 43,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Amex',
      activity: 'Yesterday',
      avatar: './assets/images/avatars/6.jpg',
      status: 'info',
      color: 'dark'
    }
  ];

  public mainChart: IChartProps = { type: 'line' };
  public mainChartRef: WritableSignal<any> = signal(undefined);
  #mainChartRefEffect = effect(() => {
    if (this.mainChartRef()) {
      this.setChartStyles();
    }
  });
  public chart: Array<IChartProps> = [];
  public trafficRadioGroup = new FormGroup({
    trafficRadio: new FormControl('Month')
  });

  globalBalance:any;
  platformBalance:any;
  marchandBalance:any
  totalPaymentAmountPerProvider:{provider:string, amount:any}[] = [];

  ngOnInit(): void {
    // this.initCharts();
    // this.updateChartOnColorModeChange();
    this.loadBalance();
    this.analyticsService.getTotalAmountPerProvider().subscribe(
      (data) => {
        Object.entries(data).forEach(([k,v]) =>{
            this.totalPaymentAmountPerProvider.push(
              {
                provider:  k,
                amount: this.formatAmount(<number>v)
              }
            )
        })

      }
    )

    this.getPaymentStateStats();

    this.getAmountOfLastTwelveMonths()
  }

  // Load Balance: Global, Plateform and merchands
  loadBalance() {
    this.paymentService.getGlobalBalance().subscribe(
      (data) => {
        this.globalBalance = data;
        this.calculateMerchandbalance();
      }
    )

    this.paymentService.getPaltfomrBalance().subscribe(
      (data) => {
        this.platformBalance = data;
        this.calculateMerchandbalance();
      }
    )

  }

  // Payment count per state Chart
  paymentStateChartData:ChartData<'pie'> = {
    labels: ['Paiement terminé', 'Paiement échoué'],
    datasets: []
  }

  paymentStateChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  }

  getPaymentStateStats() {
    this.analyticsService.getPaymentCountPerState().subscribe(
      (data:any[]) => {
        const labels = data.map(row =>
        row.state === 'COMPLETED'
          ? 'Paiement terminé'
          : 'Paiement échoué'
      );

      const values = data.map(row => row.count);

      const colors = data.map(row =>
        row.state === 'COMPLETED'
          ? 'rgb(11, 132, 92)'
          : 'rgb(255, 99, 132)'
      );

      this.paymentStateChartData = {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors
          }
        ]
      };

      }
    )
  }


  // Get total payment amount per month during the last twelve months


  data = [
    { year: 2010, count: 10 },
    { year: 2011, count: 20 },
    { year: 2012, count: 15 },
    { year: 2013, count: 25 },
    { year: 2014, count: 22 },
    { year: 2015, count: 30 },
    { year: 2016, count: 28 },
  ];

    amountOfLastTwelveMonthsChartData: ChartData<'line' | 'bar'> = {
      labels: this.data.map(row => row.year),
      datasets: [
        {
          data : this.data.map(row => row.count),
          label: "Paiements des 12 derniers mois"
        }
      ]
    }

      public chartOptions: ChartOptions<'line' | 'bar'> = {
        responsive: true
      };

  getAmountOfLastTwelveMonths() {
    this.analyticsService.getTotalAmountPerMonthDuringLastTwelveMonths().subscribe(
      (result) => {
        const labels = Object.keys(result).reverse();
        const values:number[] = (<number[]> Object.values(result)).reverse();

        this.amountOfLastTwelveMonthsChartData = {
          labels: labels,
          datasets: [
            {
              type:'line',
              data: values,
              label: 'Montant total',
              fill: false,
              tension: 0.4 
            },
            {
              type:'bar',
              data: values,
              label: 'Montant total'
            }
            
          ]
        };
      }
    )
  }


  // chartLabels = this.data.map(row => row.year);


  public calculateMerchandbalance() {
    if (this.globalBalance && this.platformBalance) {
      this.marchandBalance = this.globalBalance.amount - this.platformBalance.amount
    }
  }

  formatAmount(amount:number) {
      return amount? MoneyUtility.formatToXOF(amount): MoneyUtility.formatToXOF(0)
  }

   getLogoUrl(name:string) {
      return getPaymentMethodLogo(name);
    }

  initCharts(): void {
    this.mainChartRef()?.stop();
    this.mainChart = this.#chartsData.mainChart;
  }

  setTrafficPeriod(value: string): void {
    this.trafficRadioGroup.setValue({ trafficRadio: value });
    this.#chartsData.initMainChart(value);
    this.initCharts();
  }

  handleChartRef($chartRef: any) {
    if ($chartRef) {
      this.mainChartRef.set($chartRef);
    }
  }

  updateChartOnColorModeChange() {
    const unListen = this.#renderer.listen(this.#document.documentElement, 'ColorSchemeChange', () => {
      this.setChartStyles();
    });

    this.#destroyRef.onDestroy(() => {
      unListen();
    });
  }

  setChartStyles() {
    if (this.mainChartRef()) {
      setTimeout(() => {
        const options: ChartOptions = { ...this.mainChart.options };
        const scales = this.#chartsData.getScales();
        this.mainChartRef().options.scales = { ...options.scales, ...scales };
        this.mainChartRef().update();
      });
    }
  }
}
