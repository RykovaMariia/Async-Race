import { BaseComponent } from '../../../components/base-component';

export class CarsList extends BaseComponent {
  constructor() {
    super({
      tagName: 'div',
      classNames: 'car-list',
    });
  }
}
