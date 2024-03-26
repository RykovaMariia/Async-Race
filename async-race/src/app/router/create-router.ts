import { AppRoute } from '../enums/app-route';
import { IRouter } from '../interfaces/router';

export function createRoutes(router: IRouter) {
  return [
    {
      path: '',
      component: async () => {
        const { garage } = await import('../pages/garage-page/garage');
        return garage;
      },
    },
    {
      path: AppRoute.Garage,
      component: async () => {
        const { garage } = await import('../pages/garage-page/garage');
        return garage;
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
