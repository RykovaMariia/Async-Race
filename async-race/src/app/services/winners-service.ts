import { Observable } from './observable';

class WinnersService {
  private WinnersPage = new Observable<number>(1);
}

export const winnersService = new WinnersService();
