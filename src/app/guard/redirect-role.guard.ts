import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, CanDeactivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthGuardData } from 'keycloak-angular';

export const redirectRoleGuard = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  authData: AuthGuardData
): Promise<boolean | UrlTree> => {

    if (state.url !== '/' && state.url !== '') {
    return true;
  }

  const { grantedRoles } = authData;
  const roles = grantedRoles.realmRoles;
  console.log(roles)
  const router = inject(Router);

  if (roles.includes('Merchand')) {
    
    return router.parseUrl('/merchands/dashboard');
  }

  if (roles.includes('Administrator')) {
    return router.parseUrl('/dashboard');
  }

  return router.parseUrl('/404');
};