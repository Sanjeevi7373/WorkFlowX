export interface RouteMeta {
  title: string;
  category?: string;
  breadcrumb: string[];
}

export const ROUTE_TITLE_MAP: Record<string, RouteMeta> = {
  '/dashboard': {
    title: 'Dashboard',
    category: 'Operations',
    breadcrumb: ['WorkFlowX', 'Dashboard'],
  },
  '/projects': {
    title: 'Projects',
    category: 'Operations',
    breadcrumb: ['WorkFlowX', 'Projects'],
  },
  '/tasks': {
    title: 'Tasks',
    category: 'Operations',
    breadcrumb: ['WorkFlowX', 'Tasks'],
  },
  '/team': {
    title: 'Team',
    category: 'Operations',
    breadcrumb: ['WorkFlowX', 'Team'],
  },
  '/calendar': {
    title: 'Calendar',
    category: 'Operations',
    breadcrumb: ['WorkFlowX', 'Calendar'],
  },
  '/reports': {
    title: 'Reports',
    category: 'Operations',
    breadcrumb: ['WorkFlowX', 'Reports'],
  },
  '/notifications': {
    title: 'Notifications',
    category: 'Workspace',
    breadcrumb: ['WorkFlowX', 'Notifications'],
  },
  '/profile': {
    title: 'Profile',
    category: 'Account',
    breadcrumb: ['WorkFlowX', 'Profile'],
  },
  '/settings': {
    title: 'Settings',
    category: 'Account',
    breadcrumb: ['WorkFlowX', 'Settings'],
  },
  '/admin/users': {
    title: 'Users',
    category: 'Management',
    breadcrumb: ['WorkFlowX', 'Management', 'Users'],
  },
  '/admin/teams': {
    title: 'Teams',
    category: 'Management',
    breadcrumb: ['WorkFlowX', 'Management', 'Teams'],
  },
  '/admin/audit-logs': {
    title: 'Audit Logs',
    category: 'Management',
    breadcrumb: ['WorkFlowX', 'Management', 'Audit Logs'],
  },
};

/**
 * Resolves the page metadata (title, category, breadcrumbs) based on pathname
 */
export function getPageMeta(pathname: string): RouteMeta {
  // Strip trailing slashes
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';

  if (ROUTE_TITLE_MAP[normalizedPath]) {
    return ROUTE_TITLE_MAP[normalizedPath];
  }

  // Fallback for subpaths (e.g. /projects/123 -> Projects)
  const segments = normalizedPath.split('/').filter(Boolean);
  if (segments.length > 0) {
    const rootPath = `/${segments[0]}`;
    if (ROUTE_TITLE_MAP[rootPath]) {
      return {
        title: ROUTE_TITLE_MAP[rootPath].title,
        category: ROUTE_TITLE_MAP[rootPath].category,
        breadcrumb: ['WorkFlowX', ROUTE_TITLE_MAP[rootPath].title, ...segments.slice(1)],
      };
    }

    const formattedTitle = segments[segments.length - 1]
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    return {
      title: formattedTitle,
      breadcrumb: ['WorkFlowX', formattedTitle],
    };
  }

  return {
    title: 'Dashboard',
    category: 'Operations',
    breadcrumb: ['WorkFlowX', 'Dashboard'],
  };
}
