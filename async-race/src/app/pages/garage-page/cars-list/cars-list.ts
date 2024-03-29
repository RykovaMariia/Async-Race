import { BaseComponent } from '../../../components/base-component';
import { CarContainer } from '../../../components/car-container/car-container';
import { GarageFormValue } from '../../../components/garage-form/garage-form';
import { Car } from '../../../interfaces/car';
import { apiGarageService } from '../../../services/api-garage-service';

export class CarsList extends BaseComponent {
  private carElements: CarContainer[] = [];

  constructor() {
    super({
      tagName: 'div',
      classNames: 'car-list',
    });
    this.addAllCars();
  }

  private async addAllCars() {
    const cars: Car[] = await apiGarageService.getCars();
    const carContainers = cars.map((car) => {
      const carElement = new CarContainer({ classNames: 'car-container' }, car.id);
      this.carElements.push(carElement);
      return carElement;
    });
    this.insertChildren([...carContainers]);
  }

  async addNewCar(value: GarageFormValue) {
    const car: Car = await apiGarageService.createCar({
      carName: value.carName,
      carColor: value.carColor,
    });
    const carContainer = new CarContainer({ classNames: 'car-container' }, car.id);
    this.insertChild(carContainer);
  }
}
