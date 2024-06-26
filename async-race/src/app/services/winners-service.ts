import { BaseComponent } from 'Components/base-component';
import { Button } from 'Components/button/button';
import { WINNERS_LIMIT_ON_PAGE } from 'Data/constants';
import { apiWinnersService } from 'Services/api-services/api-winners-service';
import { Observable } from 'Services/observable';

export class WinnersService {
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

  increaseCurrentPage() {
    this.currentPage.notify((prev) => {
      if (prev < Math.ceil(this.winnersCount.getValue() / WINNERS_LIMIT_ON_PAGE)) {
        return prev + 1;
      }
      return prev;
    });
  }

  setPage() {
    this.currentPage.notify(this.currentPage.getValue());
  }

  getWinnersCount() {
    return this.winnersCount.getValue();
  }

  async setTotalCount() {
    const totalCount = await apiWinnersService.getWinnersCount(this.getCurrentPage());
    if (totalCount) {
      this.winnersCount.notify(+totalCount);
    }
  }

  subscribeWinnersCount({
    winnersHeading,
    backPageButton,
    nextPageButton,
  }: {
    winnersHeading: BaseComponent;
    backPageButton: Button;
    nextPageButton: Button;
  }) {
    this.setTotalCount();
    this.winnersCount.subscribe((count) => {
      winnersHeading.setTextContent(`WINNERS (${count})`);

      backPageButton.setDisableState(this.getCurrentPage() === 1);

      nextPageButton.setDisableState(
        this.getCurrentPage() === Math.ceil(this.getWinnersCount() / WINNERS_LIMIT_ON_PAGE),
      );
    });
  }
}

export const winnersService = new WinnersService();
