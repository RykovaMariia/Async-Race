import './winners.scss';
import { BaseComponent } from '../../components/base-component';
import { winnersService } from '../../services/winners-service';
import { WinnersTable } from './winners- table/winners-table';
import { PageButtons } from '../../components/page-buttons/page-buttons';

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
