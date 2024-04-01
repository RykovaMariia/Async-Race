import { Observable } from './observable';

class WinnersService {
  private currentPage = new Observable<number>(1);

  private winnersCount = new Observable<number>(0);

  subscribeCurrentPage(cb: (page: number) => void) {
    this.currentPage.subscribe((page) => cb(page));
  }

  getCurrentPage() {
    return this.currentPage.getValue();
  }

  reduceCurrentPage() {
    this.currentPage.notify((prev) => {
      if (prev > 1) {
        return prev - 1;
      }
      return prev;
    });
  }

  increasePageNumber() {
    this.currentPage.notify((prev) => {
      if (prev < Math.ceil(this.winnersCount.getValue() / 10)) {
        return prev + 1;
      }
      return prev;
    });
  }

  setPage() {
    this.currentPage.notify(this.currentPage.getValue());
  }

  setWinnersCount(totalCount: number) {
    this.winnersCount.notify(totalCount);
  }

  getWinnersCount() {
    return this.winnersCount.getValue();
  }

  subscribeWinnersCount(cb: (count: number) => void) {
    this.winnersCount.subscribe((count) => cb(count));
  }
}

export const winnersService = new WinnersService();
