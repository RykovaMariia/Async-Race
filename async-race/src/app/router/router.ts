import { AppRoute } from '../enums/app-route';
import { Route } from '../interfaces/route';
import { createRoutes } from './create-router';
import { BaseComponent } from '../components/base-component';

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
    const notFoundRoute = {
      path: AppRoute.NotFound,
      component: async () => {
        const { NotFound } = await import('../pages/not-found-page/not-found');
        return new NotFound();
      },
    };

    this.renderComponentFromRoute(notFoundRoute, url);
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
