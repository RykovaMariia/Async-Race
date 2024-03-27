import './car-container.scss';
import { Car } from '../../interfaces/car';
import { apiGarageService } from '../../services/api-garage-service';
import { BaseComponent, TaggedElementProps } from '../base-component';
import { SvgSprite } from '../svg/svg';
import { GarageForm, GarageFormValue } from '../garage-form/garage-form';

export class CarContainer extends BaseComponent {
  private carName: BaseComponent<HTMLElement>;

  private carSvg: SvgSprite;

  // eslint-disable-next-line max-lines-per-function
  constructor(
    props: TaggedElementProps,
    private id: number,
  ) {
    super({ tagName: 'div', ...props });

    const settingsContainer = new BaseComponent({
      tagName: 'div',
      classNames: 'settings-container',
    });

    this.carName = new BaseComponent({ tagName: 'h3' });
    this.setCarName();
    const deleteSvg = new SvgSprite({ classNames: 'delete' }, 'delete');
    deleteSvg.addEventListener('click', () => {
      this.deleteCar();
      this.destroy();
    });
    const settingsForm = new GarageForm(
      { classNames: 'change-car-form' },
      {
        buttonName: 'change',
        onSubmit: (value: GarageFormValue) => {
          this.changeSettingsCar(value);
          this.carName.setTextContent(value.carName);
          this.carSvg.setSvgColor(value.carColor);
          settingsForm.destroy();
        },
      },
    );
    const settingsSvg = new SvgSprite({ classNames: 'settings' }, 'settings');
    settingsSvg.addEventListener('click', () => {
      if (settingsContainer.getElement().contains(settingsForm.getElement())) {
        settingsForm.destroy();
      } else {
        settingsContainer.insertChild(settingsForm);
      }
    });

    settingsContainer.insertChildren([settingsSvg, deleteSvg, this.carName]);

    const trackContainer = new BaseComponent({ tagName: 'div', classNames: 'track-container' });

    const powerSvg = new SvgSprite({ classNames: 'power' }, 'power');
    const stopSvg = new SvgSprite({ classNames: 'stop' }, 'stop');

    this.carSvg = new SvgSprite({ classNames: 'car-icon' }, 'car');
    this.setCarColor();

    const flagSvg = new SvgSprite({ classNames: 'flag-icon' }, 'flag');

    trackContainer.insertChildren([powerSvg, stopSvg, this.carSvg, flagSvg]);

    this.insertChildren([settingsContainer, trackContainer]);
  }

  private async setCarName() {
    const car: Car = await apiGarageService.getCar(this.id);
    this.carName.setTextContent(car.name);
  }

  private async setCarColor() {
    const car: Car = await apiGarageService.getCar(this.id);
    this.carSvg.setSvgColor(car.color);
  }

  private async deleteCar() {
    await apiGarageService.deleteCar(this.id);
  }

  private async changeSettingsCar(value: GarageFormValue) {
    await apiGarageService.updateCar(this.id, { name: value.carName, color: value.carColor });
  }
}
