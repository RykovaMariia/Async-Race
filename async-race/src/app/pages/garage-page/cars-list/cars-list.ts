import './cars-list.scss';
import { BaseComponent } from 'Components/base-component';
import { CarContainer, WinnerProps } from 'Components/car-container/car-container';
import { GarageFormValue } from 'Components/garage-form/garage-form';
import { WinnerModal } from 'Components/winner-modal/winner-modal';
import { CAR_LIMIT_ON_PAGE } from 'Data/constants';
import { Car } from 'Interfaces/car';
import { apiGarageService } from 'Services/api-services/api-garage-service';
import { garageService } from 'Services/garage-service';
import { apiWinnersService } from 'Services/api-services/api-winners-service';

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

    garageService.updatePageCount(Math.ceil(garageService.getCarCount() / CAR_LIMIT_ON_PAGE));
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
