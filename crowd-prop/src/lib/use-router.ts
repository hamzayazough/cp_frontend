"use client";

import { usePathname, useRouter as useNextRouter } from "next/navigation";
import { routes, Router, routeGuards } from "./router";

export function useRouter() {
  const nextRouter = useNextRouter();
  const pathname = usePathname();

  return {
    push: nextRouter.push,
    replace: nextRouter.replace,
    back: nextRouter.back,
    forward: nextRouter.forward,
    refresh: nextRouter.refresh,

    // Current route information
    pathname,

    // Route checking utilities
    isCurrentRoute: (route: string) => Router.isCurrentRoute(pathname, route),
    isActiveRoute: (route: string) => Router.isActiveRoute(pathname, route),
    isProtectedRoute: () => routeGuards.isProtected(pathname),
    isGuestOnlyRoute: () => routeGuards.isGuestOnly(pathname),

    // Navigation helpers
    goToHome: () => nextRouter.push(routes.home),
    goToLogin: () => nextRouter.push(routes.login),
    goToDashboard: () => nextRouter.push(routes.dashboard),
    goToCampaigns: () => nextRouter.push(routes.campaigns),
    goToMessages: () => nextRouter.push(routes.messages),

    // Dynamic route navigation
    goToCampaignDetails: (id: string) =>
      nextRouter.push(Router.campaignDetails(id)),
    goToCampaignEdit: (id: string) => nextRouter.push(Router.campaignEdit(id)),
    goToPromoterProfile: (id: string) =>
      nextRouter.push(Router.promoterProfile(id)),
    goToMessageThread: (id: string) =>
      nextRouter.push(Router.messageThread(id)),
  };
}

export function useRouteParams(template: string): Record<string, string> {
  const pathname = usePathname();
  return Router.extractParams(pathname, template);
}
