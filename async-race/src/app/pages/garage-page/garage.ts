import './garage.scss';
import { BaseComponent } from '../../components/base-component';
import { GarageForm, GarageFormValue } from '../../components/garage-form/garage-form';
import { Car } from '../../interfaces/car';
import { apiGarageService } from '../../services/api-garage-service';
import { CarsList } from './cars-list/cars-list';

export class Garage extends BaseComponent {
  private garageHeading: BaseComponent<HTMLElement>;

  constructor() {
    super({
      tagName: 'main',
      classNames: 'garage',
    });

    this.garageHeading = new BaseComponent({ tagName: 'h2', classNames: 'garage-heading' });

    const carList = new CarsList();

    const createCarForm = new GarageForm(
      { classNames: 'create-car-form' },
      {
        buttonName: 'create',
        onSubmit: (value: GarageFormValue) => {
          carList.addNewCar(value);
          this.addCarCount();
        },
      },
    );

    const pageHeading = new BaseComponent({ tagName: 'h2', textContent: 'Page' });

    this.addCarCount();

    this.insertChildren([createCarForm, this.garageHeading, pageHeading, carList]);
  }

  private async addCarCount() {
    const cars: Car[] = await apiGarageService.getCars();
    this.garageHeading.setTextContent(`GARAGE (${cars.length})`);
  }
}
