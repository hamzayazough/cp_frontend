export const routes = {
  // Public routes
  home: "/",

  // Auth routes
  login: "/auth",
  register: "/auth",
  forgotPassword: "/auth/forgot-password",

  // Explore routes
  exploreCampaigns: "/explore/campaigns",

  // Dashboard routes
  dashboard: "/dashboard",
  profile: "/dashboard/profile",
  settings: "/dashboard/settings",

  // Campaign routes
  campaigns: "/campaigns",
  campaignCreate: "/campaigns/create",
  campaignDetails: (id: string) => `/campaigns/${id}`,
  campaignEdit: (id: string) => `/campaigns/${id}/edit`,

  // Promoter routes
  promoters: "/promoters",
  promoterProfile: (id: string) => `/promoters/${id}`,

  // Chat routes
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
