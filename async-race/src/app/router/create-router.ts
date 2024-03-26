import { AppRoute } from '../enums/app-route';
import { IRouter } from '../interfaces/router';

export function createRoutes(router: IRouter) {
  return [
    {
      path: '',
      component: async () => {
        const { Garage } = await import('../pages/garage-page/garage');
        return new Garage();
      },
    },
    {
      path: AppRoute.Garage,
      component: async () => {
        const { Garage } = await import('../pages/garage-page/garage');
        return new Garage();
      },
    },
    {
      path: AppRoute.Winners,
      component: async () => {
        const { Winners } = await import('../pages/winners-page/winners');
        return new Winners(router);
      },
    },
    {
      path: AppRoute.NotFound,
      component: async () => {
        const { NotFound } = await import('../pages/not-found-page/not-found');
        return new NotFound(router);
      },
    },
  ];
}
