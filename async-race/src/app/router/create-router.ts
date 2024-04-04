import { AppRoute } from 'Enums/app-route';
import { localStorageService } from 'Services/storage-service';

export function createRoutes() {
  return [
    {
      path: '',
      component: async () => {
        localStorageService.saveData('openPage', 'garage');
        const { garagePage } = await import('Pages/garage-page/garage');
        return garagePage;
      },
    },
    {
      path: AppRoute.Garage,
      component: async () => {
        localStorageService.saveData('openPage', 'garage');
        const { garagePage } = await import('Pages/garage-page/garage');
        return garagePage;
      },
    },
    {
      path: AppRoute.Winners,
      component: async () => {
        localStorageService.saveData('openPage', 'winners');
        const { Winners } = await import('Pages/winners-page/winners');
        return new Winners();
      },
    },
  ];
}
