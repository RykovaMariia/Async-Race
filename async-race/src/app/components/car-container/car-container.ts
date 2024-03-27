import './car-container.scss';
import { Car } from '../../interfaces/car';
import { apiGarageService } from '../../services/api-garage-service';
import { BaseComponent, TaggedElementProps } from '../base-component';
import { SvgContainer } from '../svg-container/svg-container';
import { GarageForm, GarageFormValue } from '../garage-form/garage-form';
import { Button } from '../button/button';
import { apiEngineService } from '../../services/api-engine-service';

interface RideParam {
  velocity: number;
  distance: number;
}

function easeInOut(time: number) {
  return 0.5 * (1 - Math.cos(Math.PI * time));
}

export class CarContainer extends BaseComponent {
  private carName = new BaseComponent({ tagName: 'h3' });

  private carSvg = new SvgContainer({ classNames: 'car-icon' }, 'car');

  private trackContainer = new BaseComponent({ tagName: 'div', classNames: 'track-container' });

  private requestAnimationFrameId: number = 0;

  private settingsForm: GarageForm;

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

    this.settingsForm = new GarageForm(
      { classNames: 'change-car-form' },
      {
        buttonName: 'change',
        onSubmit: (value: GarageFormValue) => {
          apiGarageService.updateCar(id, { name: value.carName, color: value.carColor });
          this.carName.setTextContent(value.carName);
          this.carSvg.setSvgColor(value.carColor);
          this.settingsForm.destroy();
        },
      },
    );
    const settingsSvg = new SvgContainer({ classNames: 'button_settings' }, 'settings');
    const settingsButton = new Button(
      { classNames: 'button_settings', parentNode: settingsSvg },
      () => {
        if (settingsContainer.isContainsChild(this.settingsForm)) {
          this.settingsForm.destroy();
        } else {
          settingsContainer.insertChild(this.settingsForm);
        }
      },
    );

    settingsContainer.insertChildren([settingsButton, deleteButton, this.carName]);

    const powerSvg = new SvgContainer({}, 'power');
    const powerButton = new Button({ classNames: 'button_power', parentNode: powerSvg });
    const stopSvg = new SvgContainer({}, 'stop');
    const stopButton = new Button({ classNames: 'button_stop', parentNode: stopSvg });
    powerButton.setOnClick(() => {
      this.driveCarAnimation(id);
      this.toggleButtons(powerButton, stopButton);
    });
    stopButton.setOnClick(() => {
      this.stopAnimation(id);
      this.toggleButtons(stopButton, powerButton);
    });

    this.toggleButtons(stopButton, powerButton);

    const flagSvg = new SvgContainer({ classNames: 'flag-icon' }, 'flag');

    this.trackContainer.insertChildren([powerButton, this.carSvg, flagSvg]);

    this.insertChildren([settingsContainer, this.trackContainer]);
  }

  private async setCarName(id: number) {
    const car: Car = await apiGarageService.getCar(id);
    this.carName.setTextContent(car.name);
    this.settingsForm.setTextInputValue(car.name);
  }

  private async setCarColor(id: number) {
    const car: Car = await apiGarageService.getCar(id);
    this.carSvg.setSvgColor(car.color);
  }

  private toggleButtons(firstButton: BaseComponent, secondButton: BaseComponent) {
    firstButton.destroy();
    this.trackContainer.insertChild(secondButton);
  }

  private async driveCarAnimation(id: number) {
    const rideParam: RideParam = await apiEngineService.starCarsEngine(id);
    const animationTime = rideParam.distance / rideParam.velocity;
    this.startDrive(animationTime, (progress) => {
      const distance = document.body.clientWidth - 200;
      const translate = easeInOut(progress) * distance;
      this.carSvg.setStyleTransformTranslateX(translate);
    });
    this.driveResponse(id);
  }

  private driveResponse = async (id: number) => {
    try {
      await apiEngineService.driveCarsEngine(id);
    } catch (err) {
      cancelAnimationFrame(this.requestAnimationFrameId);
    }
  };

  private async stopAnimation(id: number) {
    const rideParam: RideParam = await apiEngineService.stopCarsEngine(id);
    if (rideParam.velocity === 0) {
      cancelAnimationFrame(this.requestAnimationFrameId);
      this.carSvg.setStyleTransformTranslateX(0);
    }
  }

  private startDrive = (duration: number, callback: FrameRequestCallback) => {
    let startAnimation: number = 0;

    const measure = (time: number) => {
      if (!startAnimation) {
        startAnimation = time;
      }

      const progress = (time - startAnimation) / duration;

      callback(progress);

      if (progress < 1) {
        this.requestAnimationFrameId = requestAnimationFrame(measure);
      }
    };
    this.requestAnimationFrameId = requestAnimationFrame(measure);
  };
}
