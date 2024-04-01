import './winners.scss';
import { BaseComponent } from '../../components/base-component';
import { winnersService } from '../../services/winners-service';
import { WinnersTable } from './winners- table/winners-table';
import { apiWinnersService } from '../../services/api-winners-service';
import { Button } from '../../components/button/button';

async function setTotalCount() {
  const totalCount = await apiWinnersService.getTotalCount(winnersService.getCurrentPage());
  if (totalCount) {
    winnersService.setWinnersCount(+totalCount);
  }
}

export class Winners extends BaseComponent {
  private winnersHeading = new BaseComponent({ tagName: 'h2', classNames: 'winners-heading' });

  private backPageButton = new Button(
    { textContent: 'back-page' },
    {
      onclick: () => {
        this.onClickBackPageButton();
      },
    },
  );

  private nextPageButton = new Button(
    { textContent: 'next-page' },
    {
      onclick: () => {
        this.onClickNextPageButton();
      },
    },
  );

  private table = new WinnersTable();

  constructor() {
    super({
      tagName: 'main',
      classNames: 'winners',
    });

    setTotalCount();
    winnersService.subscribeWinnersCount((count) =>
      this.winnersHeading.setTextContent(`WINNERS (${count})`),
    );

    const pageHeading = new BaseComponent({ tagName: 'h2' });
    winnersService.subscribeCurrentPage((page) => pageHeading.setTextContent(`Page#${page}`));
    winnersService.setPage();

    const pageButtonContainer = new BaseComponent({ tagName: 'div', classNames: 'page-buttons' });
    pageButtonContainer.insertChildren([this.backPageButton, this.nextPageButton]);

    this.insertChildren([this.winnersHeading, pageHeading, this.table, pageButtonContainer]);
  }

  private async onClickBackPageButton() {
    const currentPage = winnersService.getCurrentPage();
    const pageCount = Math.ceil(winnersService.getWinnersCount() / 10);
    if (currentPage <= pageCount) this.nextPageButton.setDisableState(false);
    if (currentPage <= 2) this.backPageButton.setDisableState(true);
    winnersService.reduceCurrentPage();

    this.table.destroyRows();
    await this.table.drawTable();
  }

  private async onClickNextPageButton() {
    const currentPage = winnersService.getCurrentPage();
    const pageCount = Math.ceil(winnersService.getWinnersCount() / 10);
    if (currentPage >= pageCount - 1) this.nextPageButton.setDisableState(true);
    if (currentPage >= 1) this.backPageButton.setDisableState(false);
    winnersService.increasePageNumber();

    this.table.destroyRows();
    await this.table.drawTable();
  }
}
