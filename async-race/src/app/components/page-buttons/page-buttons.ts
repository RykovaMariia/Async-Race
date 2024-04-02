import { GarageService } from '../../services/garage-service';
import { WinnersService } from '../../services/winners-service';
import { BaseComponent } from '../base-component';
import { Button } from '../button/button';

function getPageCount(service: GarageService | WinnersService) {
  if (service instanceof GarageService) {
    return Math.ceil(service.getCarCount() / 7);
  }
  return Math.ceil(service.getWinnersCount() / 10);
}

export class PageButtons extends BaseComponent {
  private backPageButton = new Button(
    { textContent: 'back-page' },
    {
      onclick: () => {
        this.onClickBackPageButton(this.service, this.drawPage);
      },
    },
  );

  private nextPageButton = new Button(
    { textContent: 'next-page' },
    {
      onclick: () => {
        this.onClickNextPageButton(this.service, this.drawPage);
      },
    },
  );

  constructor(
    private service: GarageService | WinnersService,
    private drawPage: () => void,
  ) {
    super({ tagName: 'div', classNames: 'page-buttons' });
    this.insertChildren([this.backPageButton, this.nextPageButton]);
  }

  getPageButtons() {
    return { backPageButton: this.backPageButton, nextPageButton: this.nextPageButton };
  }

  private async onClickBackPageButton(
    service: GarageService | WinnersService,
    drawPage: () => void,
  ) {
    const currentPage = service.getCurrentPage();
    const pageCount = getPageCount(service);
    if (currentPage <= pageCount) this.nextPageButton.setDisableState(false);
    if (currentPage <= 2) this.backPageButton.setDisableState(true);

    service.reduceCurrentPage();

    drawPage();
  }

  private async onClickNextPageButton(
    service: GarageService | WinnersService,
    drawPage: () => void,
  ) {
    const currentPage = service.getCurrentPage();
    const pageCount = getPageCount(service);

    if (currentPage >= pageCount - 1) this.nextPageButton.setDisableState(true);
    if (currentPage >= 1) this.backPageButton.setDisableState(false);
    service.increaseCurrentPage();

    drawPage();
  }
}
