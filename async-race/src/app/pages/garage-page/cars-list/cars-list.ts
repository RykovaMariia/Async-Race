import './cars-list.scss';
import { BaseComponent } from '../../../components/base-component';
import { CarContainer } from '../../../components/car-container/car-container';
import { GarageFormValue } from '../../../components/garage-form/garage-form';
import { Car } from '../../../interfaces/car';
import { apiGarageService } from '../../../services/api-garage-service';
import { garageService } from '../../../services/garage-service';

function filterForPage(cars: CarContainer[]) {
  const currentPage = garageService.pageNumber.getValue();
  const pageElements = cars.filter(
    (_, index) => index >= (currentPage - 1) * 7 && index + 1 <= currentPage * 7,
  );
  return pageElements;
}

async function onUpdateCar(id: number, value: GarageFormValue) {
  await apiGarageService.updateCar(id, { name: value.carName, color: value.carColor });
}

export class CarsList extends BaseComponent {
  private carElements: CarContainer[] = [];

  private pageCount: number = 1;

  private pageElements: CarContainer[] = [];

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
      return new CarContainer(
        { classNames: 'car-container' },
        { car, onDeleteCar: (id: number) => this.onDeleteCar(id), onUpdateCar },
      );
    });
    this.pageCount = Math.ceil(cars.length / 7);
    this.carElements = [];
    this.carElements.push(...carContainers);
  }

  async drawCars() {
    await this.addAllCars();
    this.pageElements = filterForPage(this.carElements);

    this.element.innerHTML = '';
    this.insertChildren([...this.pageElements]);
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
    const carContainer = new CarContainer(
      { classNames: 'car-container' },
      { car, onDeleteCar: (id: number) => this.onDeleteCar(id), onUpdateCar },
    );
    this.carElements.push(carContainer);

    await this.drawCars();
  }

  async onDeleteCar(id: number) {
    await apiGarageService.deleteCar(id);
    garageService.carCount.notify((count) => count - 1);
    await this.drawCars();
  }

  async raceCars() {
    this.pageElements.map((car) => car.driveCar());
  }

  async resetCars() {
    this.pageElements.map((car) => car.resetCar());
  }
}
