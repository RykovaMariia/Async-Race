import { Car } from '../../interfaces/car';
import { apiGarageService } from '../../services/api-garage-service';
import { BaseComponent, TaggedElementProps } from '../base-component';

export class CarContainer extends BaseComponent {
  private carName: BaseComponent<HTMLElement>;

  constructor(
    props: TaggedElementProps,
    private id: number,
  ) {
    super({ tagName: 'div', ...props });

    this.carName = new BaseComponent({ tagName: 'h3' });
    this.setCarName();

    this.insertChildren([]);
  }

  private async setCarName() {
    const car: Car = await apiGarageService.getCar(this.id);
    this.carName.setTextContent(car.name);
  }
}
