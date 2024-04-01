import './cars-list.scss';
import { BaseComponent } from '../../../components/base-component';
import { CarContainer, WinnerProps } from '../../../components/car-container/car-container';
import { GarageFormValue } from '../../../components/garage-form/garage-form';
import { Car } from '../../../interfaces/car';
import { apiGarageService } from '../../../services/api-garage-service';
import { garageService } from '../../../services/garage-service';
import { apiWinnersService } from '../../../services/api-winners-service';

const MAX_CARS_COUNT_IN_PAGE = 7;

function filterForPage(cars: CarContainer[]) {
  const currentPage = garageService.pageNumber.getValue();
  const pageElements = cars.filter(
    (_, index) =>
      index >= (currentPage - 1) * MAX_CARS_COUNT_IN_PAGE &&
      index + 1 <= currentPage * MAX_CARS_COUNT_IN_PAGE,
  );
  return pageElements;
}

async function onUpdateCar(id: number, value: GarageFormValue) {
  await apiGarageService.updateCar(id, { name: value.carName, color: value.carColor });
}

async function createWinner(winnerProps: WinnerProps) {
  try {
    const winner = await apiWinnersService.getWinner(winnerProps.id);
    const { wins } = winner;
    await apiWinnersService.updateWinner(winnerProps.id, {
      wins: wins + 1,
      time: Math.min(winnerProps.time, winner.time),
    });
  } catch {
    await apiWinnersService.createWinner({ id: winnerProps.id, wins: 1, time: winnerProps.time });
  }
}

export class CarsList extends BaseComponent {
  private carElements: CarContainer[] = [];

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
    this.carElements = [];
    this.carElements.push(...carContainers);
    garageService.pageCount.notify(() => Math.ceil(cars.length / MAX_CARS_COUNT_IN_PAGE));
  }

  async drawCars() {
    await this.addAllCars();
    this.pageElements = filterForPage(this.carElements);

    this.element.innerHTML = '';
    this.insertChildren([...this.pageElements]);
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
    if (
      garageService.pageNumber.getValue() === garageService.pageCount.getValue() &&
      this.carElements.length % MAX_CARS_COUNT_IN_PAGE === 0
    ) {
      await this.drawCars();
    }
  }

  async onDeleteCar(id: number) {
    await apiGarageService.deleteCar(id);
    garageService.carCount.notify((count) => count - 1);
    await this.drawCars();
  }

  async raceCars() {
    Promise.race(this.pageElements.map((car) => car.driveCar()))
      .then((winnerProps) => {
        createWinner(winnerProps);
      })
      .catch();
  }

  async resetCars() {
    this.pageElements.map((car) => car.resetCar());
  }
}
