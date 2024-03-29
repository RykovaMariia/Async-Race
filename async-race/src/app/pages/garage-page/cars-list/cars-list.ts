import './cars-list.scss';
import { BaseComponent } from '../../../components/base-component';
import { CarContainer } from '../../../components/car-container/car-container';
import { GarageFormValue } from '../../../components/garage-form/garage-form';
import { Car } from '../../../interfaces/car';
import { apiGarageService } from '../../../services/api-garage-service';
import { pageNumber } from '../../../services/observable';

export class CarsList extends BaseComponent {
  private carElements: CarContainer[] = [];

  private pageCount: number = 1;

  constructor() {
    super({
      tagName: 'div',
      classNames: 'cars-list',
    });
    this.drawCars();
  }

  private async addAllCars() {
    const cars: Car[] = await apiGarageService.getCars();
    const carContainers = cars.map((car) => {
      return new CarContainer({ classNames: 'car-container' }, car.id);
    });
    this.pageCount = Math.ceil(cars.length / 7);
    this.carElements = [];
    this.carElements.push(...carContainers);
  }

  async drawCars() {
    await this.addAllCars();
    const currentPage = pageNumber.getValue();
    const pageElements = this.carElements.filter(
      (_, index) => index >= (currentPage - 1) * 7 && index + 1 <= currentPage * 7,
    );

    this.element.innerHTML = '';
    this.insertChildren([...pageElements]);
  }

  async getPageCount() {
    await this.addAllCars();
    return this.pageCount;
  }

  async addNewCar(value: GarageFormValue) {
    const car: Car = await apiGarageService.createCar({
      carName: value.carName,
      carColor: value.carColor,
    });
    const carContainer = new CarContainer({ classNames: 'car-container' }, car.id);
    this.carElements.push(carContainer);
    this.insertChild(carContainer);
  }
}
