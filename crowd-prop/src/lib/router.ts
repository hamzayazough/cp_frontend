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
  dashboardEarnings: "/dashboard/earnings",
  dashboardMessages: "/dashboard/messages",
  dashboardProfile: "/dashboard/profile",
  dashboardSettings: "/dashboard/settings",

  // Legacy routes (deprecated - keeping for backwards compatibility)
  profile: "/dashboard/profile",
  settings: "/dashboard/settings",

  // Role-based dashboards (deprecated - keeping for backwards compatibility)
  advertiserDashboard: "/dashboard/advertiser",
  promoterDashboard: "/dashboard/promoter",

  // Advertiser-specific routes (deprecated - keeping for backwards compatibility)
  advertiser: {
    dashboard: "/dashboard/advertiser",
    campaigns: "/dashboard/advertiser/campaigns",
    campaignCreate: "/dashboard/advertiser/campaigns/create",
    campaignDetails: (id: string) => `/dashboard/advertiser/campaigns/${id}`,
    applications: "/dashboard/advertiser/applications",
    stats: "/dashboard/advertiser/stats",
    profile: "/dashboard/advertiser/profile",
    messages: "/dashboard/advertiser/messages",
    messageThread: (id: string) => `/dashboard/advertiser/messages/${id}`,
    settings: "/dashboard/advertiser/settings",
  },

  // Promoter-specific routes (deprecated - keeping for backwards compatibility)
  promoter: {
    dashboard: "/dashboard/promoter",
    explore: "/dashboard/promoter/explore",
    campaigns: "/dashboard/promoter/campaigns",
    campaignDetails: (id: string) => `/dashboard/promoter/campaigns/${id}`,
    earnings: "/dashboard/promoter/earnings",
    profile: "/dashboard/promoter/profile",
    messages: "/dashboard/promoter/messages",
    messageThread: (id: string) => `/dashboard/promoter/messages/${id}`,
    settings: "/dashboard/promoter/settings",
  },

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
    routes.profile,
    routes.settings,
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
