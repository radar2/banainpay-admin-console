import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import {
  AvatarComponent,
  BadgeComponent,
  BreadcrumbRouterComponent,
  ColorModeService,
  ContainerComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  HeaderComponent,
  HeaderNavComponent,
  HeaderTogglerDirective,
  NavItemComponent,
  NavLinkDirective,
  SidebarToggleDirective
} from '@coreui/angular';

import { IconDirective } from '@coreui/icons-angular';
import Keycloak from 'keycloak-js';
@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  styleUrl: './default-header.component.scss',
  imports: [ContainerComponent, HeaderTogglerDirective, SidebarToggleDirective, IconDirective, HeaderNavComponent, NavItemComponent, NavLinkDirective, RouterLink, RouterLinkActive, NgTemplateOutlet, BreadcrumbRouterComponent, DropdownComponent, DropdownToggleDirective, AvatarComponent, DropdownMenuDirective, DropdownHeaderDirective, DropdownItemDirective, BadgeComponent, DropdownDividerDirective]
})
export class DefaultHeaderComponent extends HeaderComponent implements OnInit{

  readonly #colorModeService = inject(ColorModeService);
  readonly colorMode = this.#colorModeService.colorMode;

  readonly colorModes = [
    { name: 'light', text: 'Light', icon: 'cilSun' },
    { name: 'dark', text: 'Dark', icon: 'cilMoon' },
    { name: 'auto', text: 'Auto', icon: 'cilContrast' }
  ];

  readonly icons = computed(() => {
    const currentMode = this.colorMode();
    return this.colorModes.find(mode => mode.name === currentMode)?.icon ?? 'cilSun';
  });
  private readonly keycloak = inject(Keycloak);
  user: User | any;
  constructor() {
    super();
  }

  async ngOnInit() {
    if (this.keycloak?.authenticated) {
      const profile = await this.keycloak.loadUserProfile();
      
      this.user = {
        name: `${profile?.firstName} ${profile.lastName}`,
        email: profile?.email,
        username: profile?.username
      };
    }

    
  }

  logout() {
    this.keycloak.logout();
  }

  sidebarId = input('sidebar1');



}


export interface User {
  username:string;
  name:string;
  email:string;
}
