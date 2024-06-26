import { BaseComponent } from 'Components/base-component';
import { Button } from 'Components/button/button';
import { GarageForm, GarageFormValue } from 'Components/garage-form/garage-form';
import { garageService } from 'Services/garage-service';
import { getRandomCar } from 'Utils/generate-random-car';

export const CAR_COUNT_FOR_GENERATE_RANDOM = 100;

interface CarListCallBack {
  onCreateCar: (value: GarageFormValue) => Promise<void>;
  onRaceCars: () => Promise<void>;
  onResetCars: () => Promise<void>;
}

export class GarageSettings extends BaseComponent {
  private raceResetButton: Button;

  private isRaceButton = true;

  // eslint-disable-next-line max-lines-per-function
  constructor(private carListCallBacks: CarListCallBack) {
    super({
      tagName: 'div',
      classNames: 'garage__setting',
    });

    this.raceResetButton = new Button(
      { textContent: 'RACE' },
      {
        onclick: () => {
          this.onClickRaceResetButton();
        },
      },
    );

    garageService.subscribeDisableRaceButton(this.raceResetButton);

    const randomButton = new Button(
      { textContent: 'create random cars' },
      {
        onclick: () => {
          for (let i = 0; i < CAR_COUNT_FOR_GENERATE_RANDOM; i += 1) {
            this.carListCallBacks.onCreateCar(getRandomCar());
            garageService.reduceCarCount();
          }
        },
      },
    );

    const createCarForm = new GarageForm(
      { classNames: 'create-car-form' },
      {
        buttonName: 'create',
        onSubmit: (value: GarageFormValue) => {
          this.carListCallBacks.onCreateCar(value);
          garageService.reduceCarCount();
        },
      },
    );

    garageService.subscribeFormValues((formValues) => {
      createCarForm.setTextInputValue(formValues.text);
      createCarForm.setColorInputValue(formValues.color);
    });

    this.insertChildren([this.raceResetButton, randomButton, createCarForm]);
  }

  private async onClickRaceResetButton() {
    if (this.isRaceButton) {
      this.carListCallBacks.onRaceCars();
      this.raceResetButton.setTextContent('RESET');
      this.isRaceButton = false;
    } else {
      this.carListCallBacks.onResetCars();
      this.raceResetButton.setTextContent('RACE');
      this.isRaceButton = true;
    }
  }
}
