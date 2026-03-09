import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';

import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  INavData,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems, merchandNavItems } from './_nav';
import Keycloak from 'keycloak-js'

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    ContainerComponent,
    DefaultFooterComponent,
    DefaultHeaderComponent,
    IconDirective,
    NgScrollbar,
    RouterOutlet,
    RouterLink,
    ShadowOnScrollDirective
  ]
})
export class DefaultLayoutComponent implements OnInit{
  private readonly keycloak = inject(Keycloak)

  public navItems:INavData[] = [];

  async ngOnInit() {
    if (this.keycloak.authenticated) {
      if (this.keycloak.hasRealmRole("Merchand")) {
        this.navItems = [...merchandNavItems]
        // const profile = await this.keycloak.loadUserInfo();
        // console.log(profile['groups'])
      }
      if(this.keycloak.hasRealmRole("Administrator")) {
        this.navItems = [...navItems]
      }
      
    }
  }

}
