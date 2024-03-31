import './car-container.scss';
import { Car } from '../../interfaces/car';
import { apiGarageService } from '../../services/api-garage-service';
import { BaseComponent, TaggedElementProps } from '../base-component';
import { SvgContainer } from '../svg-container/svg-container';
import { GarageForm, GarageFormValue } from '../garage-form/garage-form';
import { Button } from '../button/button';
import { apiEngineService } from '../../services/api-engine-service';
import { Observable, carCount } from '../../services/observable';

interface RideParam {
  velocity: number;
  distance: number;
}

function easeInOut(time: number) {
  return 0.5 * (1 - Math.cos(Math.PI * time));
}

export class CarContainer extends BaseComponent {
  private carName = new BaseComponent({ tagName: 'h3' });

  private carSvg = new SvgContainer('car', { classNames: 'car-icon' });

  private trackContainer = new BaseComponent({ tagName: 'div', classNames: 'track-container' });

  private requestAnimationFrameId: number = 0;

  private settingsForm: GarageForm | null;

  private isSettingsFormOpen = new Observable(false);

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

    this.isSettingsFormOpen.subscribe((isOpen) => {
      if (this.settingsForm) {
        if (isOpen) {
          settingsContainer.insertChild(this.settingsForm);
        } else {
          this.settingsForm.destroy();
        }
      }
    });

    this.setCar();

    const deleteSvg = new SvgContainer('delete');
    const deleteButton = new Button(
      { classNames: 'button_delete', parentNode: deleteSvg },
      { onclick: () => this.deleteCar() },
    );

    this.settingsForm = new GarageForm(
      { classNames: 'change-car-form' },
      {
        buttonName: 'change',
        onSubmit: (value: GarageFormValue) => this.onSubmitSettingsForm(value),
      },
    );
    const settingsSvg = new SvgContainer('settings', { classNames: 'button_settings' });
    const settingsButton = new Button(
      { classNames: 'button_settings', parentNode: settingsSvg },
      {
        onclick: () => {
          this.isSettingsFormOpen.notify((prev) => !prev);
        },
      },
    );

    settingsContainer.insertChildren([settingsButton, deleteButton, this.carName]);

    const powerSvg = new SvgContainer('power');
    const powerButton = new Button({ classNames: 'button_power', parentNode: powerSvg });
    const stopSvg = new SvgContainer('stop');
    const stopButton = new Button({ classNames: 'button_stop', parentNode: stopSvg });
    powerButton.setOnClick(() => {
      this.driveCar();
      powerButton.toggleButton(stopButton);
    });
    stopButton.setOnClick(() => {
      this.resetCar();
      stopButton.toggleButton(powerButton);
    });

    const flagSvg = new SvgContainer('flag', { classNames: 'flag-icon' });

    this.trackContainer.insertChildren([powerButton, this.carSvg, flagSvg]);

    this.insertChildren([settingsContainer, this.trackContainer]);
  }

  private async setCar() {
    const car: Car = await apiGarageService.getCar(this.id);
    this.carName.setTextContent(car.name);
    this.settingsForm?.setTextInputValue(car.name);
    this.carSvg.setSvgColor(car.color);
  }

  private async deleteCar() {
    await apiGarageService.deleteCar(this.id);
    carCount.notify((count) => count - 1);
    this.destroy();
  }

  private async onSubmitSettingsForm(value: GarageFormValue) {
    await apiGarageService.updateCar(this.id, { name: value.carName, color: value.carColor });
    this.carName.setTextContent(value.carName);
    this.carSvg.setSvgColor(value.carColor);
    this.isSettingsFormOpen.notify(false);
  }

  async driveCar() {
    const rideParam: RideParam = await apiEngineService.starCarsEngine(this.id);
    const animationTime = rideParam.distance / rideParam.velocity;

    this.startAnimation(animationTime, (progress) => {
      const distance = document.body.clientWidth - 220;
      const translateX = easeInOut(progress) * distance;
      this.carSvg.setTransform({ translateX });
    });
    this.driveResponse(this.id);
  }

  private driveResponse = async (id: number) => {
    try {
      await apiEngineService.driveCarsEngine(id);
    } catch {
      cancelAnimationFrame(this.requestAnimationFrameId);
    }
  };

  private startAnimation = (duration: number, callback: FrameRequestCallback) => {
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

  async resetCar() {
    const rideParam: RideParam = await apiEngineService.stopCarsEngine(this.id);
    if (rideParam.velocity === 0) {
      cancelAnimationFrame(this.requestAnimationFrameId);
      this.carSvg.setTransform({ translateX: 0 });
    }
  }
}
