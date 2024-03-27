import './garage.scss';
import { BaseComponent } from '../../components/base-component';
import { CarContainer } from '../../components/car-container/car-container';
import { GarageForm, GarageFormValue } from '../../components/garage-form/garage-form';
import { Car } from '../../interfaces/car';
import { apiGarageService } from '../../services/api-garage-service';

export class Garage extends BaseComponent {
  private garageHeading: BaseComponent<HTMLElement>;

  constructor() {
    super({
      tagName: 'main',
      classNames: 'garage',
    });

    this.garageHeading = new BaseComponent({ tagName: 'h2', classNames: 'garage-heading' });

    const createCarForm = new GarageForm(
      { classNames: 'create-car-form' },
      {
        buttonName: 'create',
        onSubmit: (value: GarageFormValue) => {
          this.addNewCar(value);
          this.addCarCount();
        },
      },
    );

    const pageHeading = new BaseComponent({ tagName: 'h2', textContent: 'Page' });

    this.addCarCount();
    this.addAllCars();

    this.insertChildren([createCarForm, this.garageHeading, pageHeading]);
  }

  private async addCarCount() {
    const cars: Car[] = await apiGarageService.getCars();
    this.garageHeading.setTextContent(`GARAGE (${cars.length})`);
  }

  private async addAllCars() {
    const cars: Car[] = await apiGarageService.getCars();
    const carContainers = cars.map((car) => {
      return new CarContainer({ classNames: 'car-container' }, car.id);
    });
    this.insertChildren([...carContainers]);
  }

  private async addNewCar(value: GarageFormValue) {
    const car: Car = await apiGarageService.createCar({
      carName: value.carName,
      carColor: value.carColor,
    });
    const carContainer = new CarContainer({ classNames: 'car-container' }, car.id);
    this.insertChild(carContainer);
  }
}
