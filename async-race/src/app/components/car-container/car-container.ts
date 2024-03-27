import './car-container.scss';
import { Car } from '../../interfaces/car';
import { apiGarageService } from '../../services/api-garage-service';
import { BaseComponent, TaggedElementProps } from '../base-component';
import { SvgContainer } from '../svg-container/svg-container';
import { GarageForm, GarageFormValue } from '../garage-form/garage-form';
import { Button } from '../button/button';

export class CarContainer extends BaseComponent {
  private carName = new BaseComponent({ tagName: 'h3' });

  private carSvg = new SvgContainer({ classNames: 'car-icon' }, 'car');

  private trackContainer = new BaseComponent({ tagName: 'div', classNames: 'track-container' });

  // eslint-disable-next-line max-lines-per-function
  constructor(props: TaggedElementProps, id: number) {
    super({ tagName: 'div', ...props });

    const settingsContainer = new BaseComponent({
      tagName: 'div',
      classNames: 'settings-container',
    });

    this.setCarName(id);
    this.setCarColor(id);

    const deleteSvg = new SvgContainer({}, 'delete');
    const deleteButton = new Button({ classNames: 'button_delete', parentNode: deleteSvg }, () => {
      apiGarageService.deleteCar(id);
      this.destroy();
    });

    const settingsForm = new GarageForm(
      { classNames: 'change-car-form' },
      {
        buttonName: 'change',
        onSubmit: (value: GarageFormValue) => {
          apiGarageService.updateCar(id, { name: value.carName, color: value.carColor });
          this.carName.setTextContent(value.carName);
          this.carSvg.setSvgColor(value.carColor);
          settingsForm.destroy();
        },
      },
    );
    const settingsSvg = new SvgContainer({ classNames: 'button_settings' }, 'settings');
    const settingsButton = new Button(
      { classNames: 'button_settings', parentNode: settingsSvg },
      () => {
        if (settingsContainer.getElement().contains(settingsForm.getElement())) {
          settingsForm.destroy();
        } else {
          settingsContainer.insertChild(settingsForm);
        }
      },
    );

    settingsContainer.insertChildren([settingsButton, deleteButton, this.carName]);

    const powerButton = new SvgContainer({ classNames: 'button_power' }, 'power');
    const stopButton = new SvgContainer({ classNames: 'button_stop' }, 'stop');
    this.toggleButtons(powerButton, stopButton);
    this.toggleButtons(stopButton, powerButton);

    const flagSvg = new SvgContainer({ classNames: 'flag-icon' }, 'flag');

    this.trackContainer.insertChildren([powerButton, this.carSvg, flagSvg]);

    this.insertChildren([settingsContainer, this.trackContainer]);
  }

  private async setCarName(id: number) {
    const car: Car = await apiGarageService.getCar(id);
    this.carName.setTextContent(car.name);
  }

  private async setCarColor(id: number) {
    const car: Car = await apiGarageService.getCar(id);
    this.carSvg.setSvgColor(car.color);
  }

  private toggleButtons(firstButton: BaseComponent, secondButton: BaseComponent) {
    firstButton.addEventListener('click', () => {
      firstButton.destroy();
      this.trackContainer.insertChild(secondButton);
    });
  }
}
