import './garage.scss';
import { BaseComponent } from '../../components/base-component';
import { GarageForm, GarageFormValue } from '../../components/garage-form/garage-form';
import { Car } from '../../interfaces/car';
import { apiGarageService } from '../../services/api-garage-service';
import { CarsList } from './cars-list/cars-list';
import { carCount, pageNumber } from '../../services/observable';
import { Button } from '../../components/button/button';

async function addCarCount() {
  const cars: Car[] = await apiGarageService.getCars();
  carCount.notify(cars.length);
}

export class Garage extends BaseComponent {
  private garageHeading: BaseComponent<HTMLElement>;

  private carList: CarsList;

  private backPageButton: Button;

  private nextPageButton: Button;

  // eslint-disable-next-line max-lines-per-function
  constructor() {
    super({
      tagName: 'main',
      classNames: 'garage',
    });

    this.garageHeading = new BaseComponent({ tagName: 'h2', classNames: 'garage-heading' });
    addCarCount();
    carCount.subscribe((count) => this.garageHeading.setTextContent(`GARAGE (${count})`));

    this.carList = new CarsList();

    const createCarForm = new GarageForm(
      { classNames: 'create-car-form' },
      {
        buttonName: 'create',
        onSubmit: (value: GarageFormValue) => {
          this.carList.addNewCar(value);
          carCount.notify((prev) => prev + 1);
        },
      },
    );

    const pageHeading = new BaseComponent({ tagName: 'h2' });
    pageNumber.subscribe((page) => pageHeading.setTextContent(`Page #${page}`));
    pageNumber.notify(pageNumber.getValue());

    const pageButtonContainer = new BaseComponent({ tagName: 'div', classNames: 'page-buttons' });
    const currentPage = pageNumber.getValue();
    this.backPageButton = new Button(
      { classNames: 'button_back-page', textContent: 'back page' },
      {
        onclick: () => {
          this.onClickBackPageButton(currentPage);
        },
      },
    );

    this.backPageButton.setDisableState(pageNumber.getValue() === 1);

    this.nextPageButton = new Button(
      { classNames: 'button_next-page', textContent: 'next page' },
      {
        onclick: () => {
          this.onClickNextPageButton(currentPage);
        },
      },
    );
    pageButtonContainer.insertChildren([this.backPageButton, this.nextPageButton]);

    this.insertChildren([
      createCarForm,
      this.garageHeading,
      pageHeading,
      this.carList,
      pageButtonContainer,
    ]);
  }

  private async onClickBackPageButton(currentPage: number) {
    const pageCount = await this.carList.getPageCount();
    if (currentPage <= pageCount) this.nextPageButton.setDisableState(false);
    if (currentPage <= 2) this.backPageButton.setDisableState(true);
    pageNumber.notify((prev) => {
      if (prev > 1) {
        return prev - 1;
      }
      return prev;
    });

    await this.carList.drawCars();
  }

  private async onClickNextPageButton(currentPage: number) {
    const pageCount = await this.carList.getPageCount();
    if (currentPage >= pageCount - 1) this.nextPageButton.setDisableState(true);
    if (currentPage >= 1) this.backPageButton.setDisableState(false);
    pageNumber.notify((prev) => {
      if (prev < pageCount) {
        return prev + 1;
      }
      return prev;
    });

    await this.carList.drawCars();
  }
}
