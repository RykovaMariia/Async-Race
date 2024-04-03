import './garage.scss';
import { BaseComponent } from '../../components/base-component';
import { CarsList } from './cars-list/cars-list';
import { garageService } from '../../services/garage-service';
import { GarageSettings } from './garage-settings/garage-settings';
import { GarageFormValue } from '../../components/garage-form/garage-form';
import { PageButtons } from '../../components/page-buttons/page-buttons';

export class Garage extends BaseComponent {
  private carList: CarsList;

  constructor() {
    super({
      tagName: 'main',
      classNames: 'garage',
    });

    const garageHeading = new BaseComponent({ tagName: 'h2', classNames: 'garage-heading' });

    const pageHeading = new BaseComponent({ tagName: 'h2' });
    garageService.subscribeCurrentPage(pageHeading);

    this.carList = new CarsList();
    const garageSettings = new GarageSettings({
      onCreateCar: (value) => this.onSubmitCreateButton(value),
      onRaceCars: () => this.carList.raceCars(),
      onResetCars: () => this.carList.resetCars(),
    });

    const pageButtonsContainer = new PageButtons(garageService, () => this.carList.drawCars());
    const pageButtons = pageButtonsContainer.getPageButtons();
    garageService.subscribeCarCount({
      garageHeading,
      backPageButton: pageButtons.backPageButton,
      nextPageButton: pageButtons.nextPageButton,
    });

    this.insertChildren([
      garageHeading,
      garageSettings,
      pageHeading,
      this.carList,
      pageButtonsContainer,
    ]);
  }

  async onSubmitCreateButton(value: GarageFormValue) {
    await this.carList.addNewCar(value);
  }
}

export const garagePage = new Garage();
