import './garage.scss';
import { BaseComponent } from '../../components/base-component';
import { CarsList } from './cars-list/cars-list';
import { Button } from '../../components/button/button';
import { garageService } from '../../services/garage-service';
import { GarageSettings } from './garage-settings/garage-settings';
import { GarageFormValue } from '../../components/garage-form/garage-form';
import { Car } from '../../interfaces/car';
import { apiGarageService } from '../../services/api-garage-service';

async function addCarCount() {
  const cars: Car[] = await apiGarageService.getCars();
  garageService.updateCarCount(cars.length);
}

export class Garage extends BaseComponent {
  private garageHeading = new BaseComponent({ tagName: 'h2', classNames: 'garage-heading' });

  private backPageButton = new Button(
    { textContent: 'back page' },
    {
      onclick: () => {
        this.onClickBackPageButton();
      },
    },
  );

  private nextPageButton = new Button(
    { textContent: 'next page' },
    {
      onclick: () => {
        this.onClickNextPageButton();
      },
    },
  );

  private carList: CarsList;

  constructor() {
    super({
      tagName: 'main',
      classNames: 'garage',
    });
    addCarCount();

    garageService.subscribeCarCount((count) => {
      this.garageHeading.setTextContent(`GARAGE (${count})`);
      this.backPageButton.setDisableState(garageService.getPageNumber() === 1);
      garageService.subscribePageCount((pageCount) =>
        this.nextPageButton.setDisableState(garageService.getPageNumber() === pageCount),
      );
    });

    const pageHeading = new BaseComponent({ tagName: 'h2' });
    garageService.subscribePageNumber((page) => {
      pageHeading.setTextContent(`Page #${page}`);
    });
    garageService.updatePageNumber(garageService.getPageNumber());

    this.carList = new CarsList();
    const garageButtons = new GarageSettings({
      onCreateCar: (value) => this.onSubmitCreateButton(value),
      onRaceCars: () => this.carList.raceCars(),
      onResetCars: () => this.carList.resetCars(),
    });

    const pageButtonContainer = new BaseComponent({ tagName: 'div', classNames: 'page-buttons' });
    pageButtonContainer.insertChildren([this.backPageButton, this.nextPageButton]);

    this.insertChildren([
      this.garageHeading,
      garageButtons,
      pageHeading,
      this.carList,
      pageButtonContainer,
    ]);
  }

  async onSubmitCreateButton(value: GarageFormValue) {
    await this.carList.addNewCar(value);
  }

  private async onClickBackPageButton() {
    const currentPage = garageService.getPageNumber();
    const pageCount = garageService.getPageCount();
    if (currentPage <= pageCount) this.nextPageButton.setDisableState(false);
    if (currentPage <= 2) this.backPageButton.setDisableState(true);
    garageService.reducePageNumber();

    await this.carList.drawCars();
  }

  private async onClickNextPageButton() {
    const currentPage = garageService.getPageNumber();
    const pageCount = garageService.getPageCount();
    if (currentPage >= pageCount - 1) this.nextPageButton.setDisableState(true);
    if (currentPage >= 1) this.backPageButton.setDisableState(false);
    garageService.increasePageNumber();

    await this.carList.drawCars();
  }
}
