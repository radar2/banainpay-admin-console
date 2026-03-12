import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Keycloak from 'keycloak-js'
@Component({
  selector: 'app-empty',
  imports: [],
  templateUrl: './empty.component.html',
  styleUrl: './empty.component.scss',
})
export class EmptyComponent implements OnInit{
  readonly keycloak = inject(Keycloak);

  constructor(private router:Router) {}

  ngOnInit(): void {
    console.log(this.keycloak.realmAccess)
    this.redirect();
  }

  redirect() {
    if (this.keycloak.hasRealmRole('Merchand')) {
      this.router.navigate(['/merchands/dashboard'])
      
    } else if(this.keycloak.hasRealmRole('Administrator')) {
        this.router.navigate(['/dashboard'])
    } else {
      this.router.navigate(['/404'])
    }
  }

}
