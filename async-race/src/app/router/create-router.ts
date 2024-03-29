import { AppRoute } from '../enums/app-route';

export function createRoutes() {
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
        return new Winners();
      },
    },
  ];
}
