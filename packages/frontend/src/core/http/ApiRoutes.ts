export class ProjectRoutes {
  public static saveProject(): string {
    return '/project';
  }

  public static listProject(): string {
    return '/project/list';
  }

  public static findById(id: string): string {
    return `/project/${id}`;
  }
}

export class AuthenticationRoutes {
  public static login(): string {
    return '/authentication/login';
  }

  public static renew(): string {
    return '/authentication/renew';
  }

  public static register(): string {
    return '/authentication/register';
  }

  public static confirmAccount(): string {
    return '/authentication/confirm-account';
  }
}

export class DatastoreRoutes {
  public static list(): string {
    return '/datastore/list';
  }

  public static search(): string {
    return `/datastore/search`;
  }

  public static download(path: string): string {
    return `/datastore/download/${path}`;
  }
}
