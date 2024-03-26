import { Car } from '../../interfaces/car';
import { apiGarageService } from '../../services/api-garage-service';
import { BaseComponent, TaggedElementProps } from '../base-component';
import { SvgSprite } from '../svg/svg';

export class CarContainer extends BaseComponent {
  private carName: BaseComponent<HTMLElement>;

  private carSvg: SvgSprite;

  constructor(
    props: TaggedElementProps,
    private id: number,
  ) {
    super({ tagName: 'div', ...props });

    this.carName = new BaseComponent({ tagName: 'h3' });
    this.setCarName();

    this.carSvg = new SvgSprite('car');
    this.setCarColor();

    const flagSvg = new SvgSprite('flag');

    this.insertChildren([this.carName, this.carSvg, flagSvg]);
  }

  private async setCarName() {
    const car: Car = await apiGarageService.getCar(this.id);
    this.carName.setTextContent(car.name);
  }

  private async setCarColor() {
    const car: Car = await apiGarageService.getCar(this.id);
    this.carSvg.setSvgColor(car.color);
  }
}
