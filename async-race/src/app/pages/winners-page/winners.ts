import './winners.scss';
import { BaseComponent } from 'Components/base-component';
import { PageButtons } from 'Components/page-buttons/page-buttons';
import { winnersService } from 'Services/winners-service';
import { WinnersTable } from 'Pages/winners-page/winners- table/winners-table';

export class Winners extends BaseComponent {
  private table = new WinnersTable();

  constructor() {
    super({
      tagName: 'main',
      classNames: 'winners',
    });

    const winnersHeading = new BaseComponent({ tagName: 'h2', classNames: 'winners-heading' });

    const pageHeading = new BaseComponent({ tagName: 'h2' });
    winnersService.subscribeCurrentPage((page) => pageHeading.setTextContent(`Page#${page}`));
    winnersService.setPage();

    const pageButtonsContainer = new PageButtons(winnersService, () => {
      this.table.destroyRows();
      this.table.drawTable();
    });
    const pageButtons = pageButtonsContainer.getPageButtons();
    winnersService.subscribeWinnersCount({
      winnersHeading,
      backPageButton: pageButtons.backPageButton,
      nextPageButton: pageButtons.nextPageButton,
    });

    this.insertChildren([winnersHeading, pageHeading, this.table, pageButtonsContainer]);
  }
}
