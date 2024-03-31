import './garage.scss';
import { BaseComponent } from '../../components/base-component';
import { GarageForm, GarageFormValue } from '../../components/garage-form/garage-form';
import { Car } from '../../interfaces/car';
import { apiGarageService } from '../../services/api-garage-service';
import { CarsList } from './cars-list/cars-list';
import { Button } from '../../components/button/button';
import { garageService } from '../../services/garage-service';

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

  private isRaceButton = true;

  private raceResetButton: Button;

  private carList: CarsList;

  // eslint-disable-next-line max-lines-per-function
  constructor() {
    super({
      tagName: 'main',
      classNames: 'garage',
    });

    addCarCount();
    garageService.carCount.subscribe((count) => {
      this.garageHeading.setTextContent(`GARAGE (${count})`);
      this.disablePageButtons();
    });

    this.raceResetButton = new Button(
      { textContent: 'RACE' },
      {
        onclick: () => {
          this.onClickRaceResetButton();
        },
      },
    );

    const createCarForm = new GarageForm(
      { classNames: 'create-car-form' },
      {
        buttonName: 'create',
        onSubmit: (value: GarageFormValue) => {
          this.carList.addNewCar(value);
          this.carList.drawCars();
          garageService.carCount.notify((prev) => prev + 1);
        },
      },
    );

    const pageHeading = new BaseComponent({ tagName: 'h2' });
    garageService.pageNumber.subscribe((page) => {
      pageHeading.setTextContent(`Page #${page}`);
      this.disablePageButtons();
    });
    garageService.pageNumber.notify(garageService.pageNumber.getValue());

    this.carList = new CarsList();

    const pageButtonContainer = new BaseComponent({ tagName: 'div', classNames: 'page-buttons' });
    pageButtonContainer.insertChildren([this.backPageButton, this.nextPageButton]);

    this.disablePageButtons();
    this.insertChildren([
      createCarForm,
      this.garageHeading,
      this.raceResetButton,
      pageHeading,
      this.carList,
      pageButtonContainer,
    ]);
  }

  private async disablePageButtons() {
    this.backPageButton.setDisableState(garageService.pageNumber.getValue() === 1);
    const pageCount = await this.carList.getPageCount();
    this.nextPageButton.setDisableState(garageService.pageNumber.getValue() === pageCount);
  }

  private async onClickBackPageButton() {
    const currentPage = garageService.pageNumber.getValue();
    const pageCount = await this.carList.getPageCount();
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
    const pageCount = await this.carList.getPageCount();
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

  private async onClickRaceResetButton() {
    if (this.isRaceButton) {
      this.carList.raceCars();
      this.raceResetButton.setTextContent('RESET');
      this.isRaceButton = false;
    } else {
      this.carList.resetCars();
      this.raceResetButton.setTextContent('RICE');
      this.isRaceButton = true;
    }
  }
}
