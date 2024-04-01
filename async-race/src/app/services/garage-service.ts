import { Observable } from './observable';

class GarageService {
  private carCount = new Observable<number>(0);

  private pageNumber = new Observable<number>(1);

  private pageCount = new Observable<number>(1);

  addCarCount(num: number) {
    this.carCount.notify((count) => count + num);
  }

  updateCarCount(num: number) {
    this.carCount.notify(num);
  }

  subscribeCarCount(cb: (count: number) => void) {
    this.carCount.subscribe((count) => cb(count));
  }

  getPageNumber() {
    return this.pageNumber.getValue();
  }

  reducePageNumber() {
    this.pageNumber.notify((prev) => {
      if (prev > 1) {
        return prev - 1;
      }
      return prev;
    });
  }

  increasePageNumber() {
    this.pageNumber.notify((prev) => {
      if (prev < this.pageCount.getValue()) {
        return prev + 1;
      }
      return prev;
    });
  }

  updatePageNumber(num: number) {
    this.pageNumber.notify(num);
  }

  subscribePageNumber(cb: (page: number) => void) {
    this.pageNumber.subscribe((page) => cb(page));
  }

  getPageCount() {
    return this.pageCount.getValue();
  }

  updatePageCount(num: number) {
    this.pageCount.notify(num);
  }

  subscribePageCount(cb: (count: number) => void) {
    this.pageCount.subscribe((count) => cb(count));
  }
}

export const garageService = new GarageService();
