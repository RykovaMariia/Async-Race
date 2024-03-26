import { BaseComponent } from '../../components/base-component';
import { CarContainer } from '../../components/car-container/car-container';
import { GarageForm, GarageFormValue } from '../../components/garage-form/garage-form';
import { Car } from '../../interfaces/car';
import { apiGarageService } from '../../services/api-garage-service';

export class Garage extends BaseComponent {
  private headingGarage: BaseComponent<HTMLElement>;

  private headingWithPage: BaseComponent<HTMLElement>;

  constructor() {
    super({
      tagName: 'main',
      classNames: 'garage',
    });

    const formForCreateCar = new GarageForm(
      { classNames: 'form-for-create' },
      (value: GarageFormValue) => {
        this.addNewCar(value);
        this.addCarCount();
      },
    );

    this.headingGarage = new BaseComponent({ tagName: 'h1' });

    this.headingWithPage = new BaseComponent({ tagName: 'h2' });

    this.addCarCount();
    this.addAllCars();

    this.insertChildren([formForCreateCar, this.headingGarage]);
  }

  private async addCarCount() {
    const cars: Car[] = await apiGarageService.getCars();
    this.headingGarage.setTextContent(`GARAGE (${cars.length})`);
  }

  private async addAllCars() {
    const cars: Car[] = await apiGarageService.getCars();
    const carContainers = cars.map((car) => {
      return new CarContainer({}, car.id);
    });
    this.insertChildren([...carContainers]);
  }

  private async addNewCar(value: GarageFormValue) {
    const car: Car = await apiGarageService.createCar({
      nameCar: value.carName,
      colorCar: value.carColor,
    });
    const carContainer = new CarContainer({}, car.id);
    this.insertChild(carContainer);
  }
}
