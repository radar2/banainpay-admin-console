import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateFn } from "@angular/router";
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';

const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  _: RouterStateSnapshot,
  authData: AuthGuardData
): Promise<boolean | UrlTree> => {
  const { authenticated, grantedRoles } = authData;


  const requiredRoles = route.data['role'];
  if (!requiredRoles) {
    return false;
  }

//   const hasRequiredRole = (role: string): boolean =>
//     Object.values(grantedRoles.resourceRoles).some((roles) => roles.includes(role));

  const hasRequiredRole = (role: string): boolean =>
    Object.values(grantedRoles.realmRoles).some((roles) => roles.includes(role));

  for (let role of requiredRoles) {
    if (authenticated && hasRequiredRole(role)) {
      return true;
    }
  }

  const router = inject(Router);
  return router.parseUrl('/404');
};


export const canActiveAuthRoles = createAuthGuard<CanActivateFn>(isAccessAllowed)