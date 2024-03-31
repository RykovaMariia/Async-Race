import { Observable } from './observable';

class GarageService {
  carCount = new Observable<number>(0);

  pageNumber = new Observable<number>(1);
}

export const garageService = new GarageService();
