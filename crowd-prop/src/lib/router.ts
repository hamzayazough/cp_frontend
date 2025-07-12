export const routes = {
  // Public routes
  home: "/",

  // Auth routes
  login: "/auth",
  register: "/auth",
  forgotPassword: "/auth/forgot-password",

  // Onboarding
  onboarding: "/onboarding",

  // Explore routes
  exploreCampaigns: "/explore/campaigns",
  // Unified Dashboard routes (role-based content)
  dashboard: "/dashboard",
  dashboardCampaigns: "/dashboard/campaigns",
  dashboardCampaignDetails: (id: string) => `/dashboard/campaigns/${id}`,
  dashboardExplore: "/dashboard/explore",
  dashboardExploreDetails: (id: string) => `/dashboard/explore/${id}`,
  dashboardEarnings: "/dashboard/earnings",
  dashboardMessages: "/dashboard/messages",
  dashboardProfile: "/dashboard/profile",
  dashboardSettings: "/dashboard/settings",

  // Campaign routes (legacy)
  campaigns: "/campaigns",
  campaignCreate: "/campaigns/create",
  campaignDetails: (id: string) => `/campaigns/${id}`,
  campaignEdit: (id: string) => `/campaigns/${id}/edit`,

  promoters: "/promoters",
  promoterProfile: (id: string) => `/promoters/${id}`,

  // Chat routes (legacy)
  messages: "/messages",
  messageThread: (id: string) => `/messages/${id}`,

  // API routes
  api: {
    campaigns: "/api/campaigns",
    users: "/api/users",
    auth: "/api/auth",
    messages: "/api/messages",
  },
} as const;

export type StaticRoute = (typeof routes)[keyof Omit<typeof routes, "api">];

export type Route =
  | StaticRoute
  | ReturnType<typeof routes.campaignDetails>
  | ReturnType<typeof routes.campaignEdit>
  | ReturnType<typeof routes.promoterProfile>
  | ReturnType<typeof routes.messageThread>;

export class Router {
  static campaignDetails(id: string): string {
    return routes.campaignDetails(id);
  }

  static campaignEdit(id: string): string {
    return routes.campaignEdit(id);
  }

  static promoterProfile(id: string): string {
    return routes.promoterProfile(id);
  }

  static messageThread(id: string): string {
    return routes.messageThread(id);
  }

  static dashboardCampaignDetails(id: string): string {
    return routes.dashboardCampaignDetails(id);
  }

  static isCurrentRoute(pathname: string, route: string): boolean {
    return pathname === route;
  }

  static isActiveRoute(pathname: string, route: string): boolean {
    return pathname.startsWith(route);
  }

  static extractParams(
    pathname: string,
    template: string
  ): Record<string, string> {
    const templateParts = template.split("/");
    const pathnameParts = pathname.split("/");
    const params: Record<string, string> = {};

    templateParts.forEach((part, index) => {
      if (part.startsWith("[") && part.endsWith("]")) {
        const paramName = part.slice(1, -1);
        params[paramName] = pathnameParts[index] || "";
      }
    });

    return params;
  }
}

export const routeGuards = {
  protected: [
    routes.dashboard,
    routes.dashboardCampaigns,
    routes.dashboardExplore,
    routes.dashboardEarnings,
    routes.dashboardMessages,
    routes.dashboardProfile,
    routes.dashboardSettings,
    routes.campaignCreate,
    routes.messages,
  ],

  guestOnly: [routes.login, routes.register, routes.forgotPassword],

  isProtected(pathname: string): boolean {
    return this.protected.some((route) => pathname.startsWith(route));
  },

  isGuestOnly(pathname: string): boolean {
    return this.guestOnly.some((route) => pathname.startsWith(route));
  },
} as const;

export default routes;
