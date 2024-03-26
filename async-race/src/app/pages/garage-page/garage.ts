import { BaseComponent } from '../../components/base-component';
import { GarageForm } from './form/form';
import { IRouter } from '../../interfaces/router';

export class Garage extends BaseComponent {
  constructor(private router: IRouter) {
    super({
      tagName: 'main',
      classNames: 'garage',
    });

    const formForCreateCar = new GarageForm({ classNames: 'form-for-create' });
    this.insertChild(formForCreateCar);
  }
}
