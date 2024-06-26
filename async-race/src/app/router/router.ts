import { BaseComponent } from 'Components/base-component';
import { AppRoute } from 'Enums/app-route';
import { Route } from 'Interfaces/route';
import { createRoutes } from 'Router/create-router';

function parseUrl(url: string) {
  const urlInfo: { path?: string; resource?: string } = {};
  const path = url.split('/');
  [urlInfo.path = '', urlInfo.resource = ''] = path;
  return urlInfo;
}

export class Router {
  private routerOutlet: HTMLElement | null = null;

  private previousPage: BaseComponent | null = null;

  private routes: Route[] = createRoutes();

  private notFoundRoute = {
    path: AppRoute.NotFound,
    component: async () => {
      const { NotFound } = await import('Pages/not-found-page/not-found');
      return new NotFound();
    },
  };

  constructor() {
    window.addEventListener('popstate', this.browserChangeHandler.bind(this));
  }

  init(routerOutlet: HTMLElement) {
    this.routerOutlet = routerOutlet;
    const path = window.location.pathname.slice(1);
    this.navigate(path);
  }

  navigate(url: string) {
    const urlInfo = parseUrl(url);

    const pathForSearch =
      urlInfo.resource === '' ? urlInfo.path : `${urlInfo.path}/${urlInfo.resource}`;
    const route = this.routes.find((item) => item.path === pathForSearch);

    if (!route) {
      this.redirectedToNotFound(url);
      return;
    }

    this.renderComponentFromRoute(route, url);
  }

  redirectedToNotFound(url: string) {
    this.renderComponentFromRoute(this.notFoundRoute, url);
  }

  renderComponentFromRoute(route: Route, url: string) {
    route.component().then((component) => {
      if (!this.routerOutlet) {
        return;
      }
      this.previousPage?.destroy();
      this.previousPage = component;
      this.routerOutlet.append(this.previousPage.getElement());
      window.history.pushState({}, '', url);
    });
  }

  browserChangeHandler() {
    const path = window.location.pathname.slice(1);
    this.navigate(path);
  }
}

export const router = new Router();
