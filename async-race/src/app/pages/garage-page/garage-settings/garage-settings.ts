import { BaseComponent } from '../../../components/base-component';
import { Button } from '../../../components/button/button';
import { GarageForm, GarageFormValue } from '../../../components/garage-form/garage-form';
import { garageService } from '../../../services/garage-service';
import { getRandomCar } from '../../../utils/generate-random-car';

interface CarListCallBack {
  onCreateCar: (value: GarageFormValue) => Promise<void>;
  onRaceCars: () => Promise<void>;
  onResetCars: () => Promise<void>;
}

export class GarageSettings extends BaseComponent {
  private raceResetButton: Button;

  private isRaceButton = true;

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

    const randomButton = new Button(
      { textContent: 'create random cars' },
      {
        onclick: () => {
          for (let i = 0; i < 100; i += 1) {
            this.carListCallBacks.onCreateCar(getRandomCar());
            garageService.addCarCount(1);
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
          garageService.addCarCount(1);
        },
      },
    );

    this.insertChildren([this.raceResetButton, randomButton, createCarForm]);
  }

  private async onClickRaceResetButton() {
    if (this.isRaceButton) {
      this.carListCallBacks.onRaceCars();
      this.raceResetButton.setTextContent('RESET');
      this.isRaceButton = false;
    } else {
      this.carListCallBacks.onResetCars();
      this.raceResetButton.setTextContent('RICE');
      this.isRaceButton = true;
    }
  }
}
