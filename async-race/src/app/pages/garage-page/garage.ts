import { BaseComponent } from '../../components/base-component';
import { GarageForm, GarageFormValue } from '../../components/garage-form/garage-form';
import { Car } from '../../interfaces/car';
import { IRouter } from '../../interfaces/router';
import { apiGarageService } from '../../services/api-garage-service';

export class Garage extends BaseComponent {
  private headingGarage: BaseComponent<HTMLElement>;

  private headingWithPage: BaseComponent<HTMLElement>;

  constructor(private router: IRouter) {
    super({
      tagName: 'main',
      classNames: 'garage',
    });

    const formForCreateCar = new GarageForm(
      { classNames: 'form-for-create' },
      (value: GarageFormValue) =>
        apiGarageService.createCar({ nameCar: value.carName, carColor: value.carColor }),
    );

    this.headingGarage = new BaseComponent({ tagName: 'h1' });

    this.headingWithPage = new BaseComponent({ tagName: 'h2' });

    this.addCarCountInHeading();

    this.insertChildren([formForCreateCar, this.headingGarage]);
  }

  async addCarCountInHeading() {
    const cars: Car[] = await apiGarageService.getCars();
    this.headingGarage.setTextContent(`GARAGE (${cars.length})`);
  }
}
