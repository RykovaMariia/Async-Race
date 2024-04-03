import { AppRoute } from '../enums/app-route';
import { localStorageService } from '../services/storage-service';

export function createRoutes() {
  return [
    {
      path: '',
      component: async () => {
        localStorageService.saveData('openPage', 'garage');
        const { garagePage } = await import('../pages/garage-page/garage');
        return garagePage;
      },
    },
    {
      path: AppRoute.Garage,
      component: async () => {
        localStorageService.saveData('openPage', 'garage');
        const { garagePage } = await import('../pages/garage-page/garage');
        return garagePage;
      },
    },
    {
      path: AppRoute.Winners,
      component: async () => {
        localStorageService.saveData('openPage', 'winners');
        const { Winners } = await import('../pages/winners-page/winners');
        return new Winners();
      },
    },
  ];
}
