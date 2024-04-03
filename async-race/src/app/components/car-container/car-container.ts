import './car-container.scss';
import { Car } from '../../interfaces/car';
import { BaseComponent, TaggedElementProps } from '../base-component';
import { SvgContainer } from '../svg-container/svg-container';
import { GarageForm, GarageFormValue } from '../garage-form/garage-form';
import { Button } from '../button/button';
import { apiEngineService } from '../../services/api-services/api-engine-service';
import { Observable } from '../../services/observable';
import { garageService } from '../../services/garage-service';

const DISTANCE = document.body.clientWidth - 220;

interface CarContainerProps {
  car: Car;
  onDeleteCar: (id: number) => Promise<void>;
  onUpdateCar: (id: number, value: GarageFormValue) => Promise<void>;
}

interface RideParam {
  velocity: number;
  distance: number;
}

export interface WinnerProps {
  id: number;
  time: number;
}

function easeInOut(time: number) {
  return 0.5 * (1 - Math.cos(Math.PI * time));
}

function conversionToSecFromMillisec(milliseconds: number) {
  return milliseconds / 1000;
}

export class CarContainer extends BaseComponent {
  private id: number;

  private carName = new BaseComponent({ tagName: 'h3' });

  private carSvg = new SvgContainer('car', { classNames: 'car-icon' });

  private trackContainer = new BaseComponent({ tagName: 'div', classNames: 'track-container' });

  private requestAnimationFrameId: number = 0;

  private settingsForm: GarageForm | null;

  private isSettingsFormOpen = new Observable(false);

  private settingsButton: Button;

  private deleteButton: Button;

  private driveButton: Button;

  private stopButton: Button;

  // eslint-disable-next-line max-lines-per-function
  constructor(props: TaggedElementProps, carContainerProps: CarContainerProps) {
    super({ tagName: 'div', ...props });
    this.id = carContainerProps.car.id;

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

    const deleteSvg = new SvgContainer('delete');
    this.deleteButton = new Button(
      { classNames: 'button_delete', parentNode: deleteSvg },
      {
        onclick: () => {
          this.destroy();
          carContainerProps.onDeleteCar(carContainerProps.car.id);
        },
      },
    );

    this.settingsForm = new GarageForm(
      { classNames: 'change-car-form' },
      {
        buttonName: 'change',
        onSubmit: (value: GarageFormValue) => {
          carContainerProps.onUpdateCar(carContainerProps.car.id, value);
          this.setCar({ name: value.carName, color: value.carColor, id: carContainerProps.car.id });
          this.isSettingsFormOpen.notify(false);
        },
      },
    );
    const settingsSvg = new SvgContainer('settings', { classNames: 'button_settings' });
    this.settingsButton = new Button(
      { classNames: 'button_settings', parentNode: settingsSvg },
      {
        onclick: () => {
          this.isSettingsFormOpen.notify((prev) => !prev);
        },
      },
    );

    this.setCar(carContainerProps.car);

    settingsContainer.insertChildren([this.settingsButton, this.deleteButton, this.carName]);

    const powerSvg = new SvgContainer('power');
    this.driveButton = new Button({ classNames: 'button_power', parentNode: powerSvg });
    const stopSvg = new SvgContainer('stop');
    this.stopButton = new Button({ classNames: 'button_stop', parentNode: stopSvg });
    this.driveButton.setOnClick(() => {
      this.driveCar();
    });
    this.stopButton.setOnClick(() => {
      this.resetCar();
    });

    const flagSvg = new SvgContainer('flag', { classNames: 'flag-icon' });

    this.trackContainer.insertChildren([this.driveButton, this.carSvg, flagSvg]);

    this.insertChildren([settingsContainer, this.trackContainer]);
  }

  private setDisableStateSettingsButtons(state: boolean) {
    [this.settingsButton, this.deleteButton].map((button) => button.setDisableState(state));
  }

  private setCar(car: Car) {
    this.carName.setTextContent(car.name);
    this.carSvg.setSvgColor(car.color);
    this.settingsForm?.setTextInputValue(car.name);
    this.settingsForm?.setColorInputValue(car.color);
  }

  setDisableStateDriveButton(state: boolean) {
    this.driveButton.setDisableState(state);
  }

  async driveCar() {
    garageService.disableRaceButton();
    this.driveButton.toggleButton(this.stopButton);
    this.setDisableStateSettingsButtons(true);
    const rideParam: RideParam = await apiEngineService.starCarsEngine(this.id);
    const animationTime = rideParam.distance / rideParam.velocity;
    this.driveResponse(this.id);
    return this.startAnimation(animationTime, (progress) => {
      const translateX = easeInOut(progress) * DISTANCE;
      this.carSvg.setTransform({ translateX });
    });
  }

  private driveResponse = async (id: number) => {
    try {
      await apiEngineService.driveCarsEngine(id);
    } catch {
      cancelAnimationFrame(this.requestAnimationFrameId);
    }
  };

  private startAnimation = (duration: number, callback: FrameRequestCallback) => {
    return new Promise<WinnerProps>((res) => {
      let startAnimation: number = 0;
      const measure = (time: number) => {
        if (!startAnimation) {
          startAnimation = time;
        }
        const progress = (time - startAnimation) / duration;
        callback(progress);
        if (progress < 1) {
          this.requestAnimationFrameId = requestAnimationFrame(measure);
          return;
        }
        garageService.enableRaceButton();
        res({ id: this.id, time: +conversionToSecFromMillisec(+duration).toFixed(2) });
      };
      this.requestAnimationFrameId = requestAnimationFrame(measure);
    });
  };

  async resetCar() {
    garageService.disableRaceButton();
    this.stopButton.toggleButton(this.driveButton);
    this.setDisableStateSettingsButtons(false);
    const rideParam: RideParam = await apiEngineService.stopCarsEngine(this.id);
    if (rideParam.velocity === 0) {
      cancelAnimationFrame(this.requestAnimationFrameId);
      this.carSvg.setTransform({ translateX: 0 });
    }
    garageService.enableRaceButton();
  }
}
