import './cars-list.scss';
import { BaseComponent } from '../../../components/base-component';
import { CarContainer, WinnerProps } from '../../../components/car-container/car-container';
import { GarageFormValue } from '../../../components/garage-form/garage-form';
import { Car } from '../../../interfaces/car';
import { apiGarageService } from '../../../services/api-garage-service';
import { garageService } from '../../../services/garage-service';
import { apiWinnersService } from '../../../services/api-winners-service';
import { WinnerModal } from '../../../components/winner-modal/winner-modal';

const MAX_CARS_COUNT_IN_PAGE = 7;

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

  constructor() {
    super({
      tagName: 'div',
      classNames: 'cars-list',
    });
    this.drawCars();
  }

  async drawCars() {
    const cars: Car[] = await apiGarageService.getCars(garageService.getCurrentPage());
    const carContainers = cars.map((car) => {
      return new CarContainer(
        { classNames: 'car-container' },
        { car, onDeleteCar: (id: number) => this.onDeleteCar(id), onUpdateCar },
      );
    });
    this.carElements = carContainers;

    garageService.updatePageCount(Math.ceil(garageService.getCarCount() / MAX_CARS_COUNT_IN_PAGE));
    this.element.innerHTML = '';
    this.insertChildren([...carContainers]);
  }

  async addNewCar(value: GarageFormValue) {
    await apiGarageService.createCar({ carName: value.carName, carColor: value.carColor });

    await this.drawCars();
  }

  async onDeleteCar(id: number) {
    try {
      garageService.increaseCarCount();
      await apiGarageService.deleteCar(id);
      await this.drawCars();
      await apiWinnersService.deleteWinner(id);
    } catch (error) {
      /* empty */
    }
  }

  async raceCars() {
    Promise.race(this.carElements.map((car) => car.driveCar()))
      .then((winnerProps) => {
        apiGarageService.getCar(winnerProps.id).then((car) => {
          const modal = new WinnerModal({ name: car.name, time: winnerProps.time });
          this.insertChild(modal);
        });

        createWinner(winnerProps);
      })
      .catch();
  }

  async resetCars() {
    this.carElements.map((car) => car.resetCar());
  }
}
