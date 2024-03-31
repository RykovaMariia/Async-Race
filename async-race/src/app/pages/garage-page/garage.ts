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
  garageService.carCount.notify(cars.length);
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

    garageService.carCount.subscribe((count) => {
      this.garageHeading.setTextContent(`GARAGE (${count})`);
      this.backPageButton.setDisableState(garageService.pageNumber.getValue() === 1);
      garageService.pageCount.subscribe((pageCount) =>
        this.nextPageButton.setDisableState(garageService.pageNumber.getValue() === pageCount),
      );
    });

    const pageHeading = new BaseComponent({ tagName: 'h2' });
    garageService.pageNumber.subscribe((page) => {
      pageHeading.setTextContent(`Page #${page}`);
    });
    garageService.pageNumber.notify(garageService.pageNumber.getValue());

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
    const currentPage = garageService.pageNumber.getValue();
    const pageCount = garageService.pageCount.getValue();
    if (currentPage <= pageCount) this.nextPageButton.setDisableState(false);
    if (currentPage <= 2) this.backPageButton.setDisableState(true);
    garageService.pageNumber.notify((prev) => {
      if (prev > 1) {
        return prev - 1;
      }
      return prev;
    });

    await this.carList.drawCars();
  }

  private async onClickNextPageButton() {
    const currentPage = garageService.pageNumber.getValue();
    const pageCount = garageService.pageCount.getValue();
    if (currentPage >= pageCount - 1) this.nextPageButton.setDisableState(true);
    if (currentPage >= 1) this.backPageButton.setDisableState(false);
    garageService.pageNumber.notify((prev) => {
      if (prev < pageCount) {
        return prev + 1;
      }
      return prev;
    });

    await this.carList.drawCars();
  }
}
