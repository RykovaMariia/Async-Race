import { BaseComponent } from '../components/base-component';
import { Button } from '../components/button/button';
import { apiGarageService } from './api-services/api-garage-service';
import { Observable } from './observable';

const DEFAULT_COLOR = '#000000';

interface FormValues {
  text: string;
  color: string;
}

export class GarageService {
  private carCount = new Observable<number>(0);

  private pageNumber = new Observable<number>(1);

  private pageCount = new Observable<number>(1);

  private formValues = new Observable<FormValues>({ text: '', color: DEFAULT_COLOR });

  private isDisableRaceButton = new Observable<boolean>(false);

  async addCarCount() {
    const count = await apiGarageService.getCarsCount(this.getCurrentPage());
    if (count) {
      this.carCount.notify(+count);
    }
  }

  subscribeCarCount({
    garageHeading,
    backPageButton,
    nextPageButton,
  }: {
    garageHeading: BaseComponent;
    backPageButton: Button;
    nextPageButton: Button;
  }) {
    this.addCarCount();
    this.carCount.subscribe((count) => {
      garageHeading.setTextContent(`GARAGE (${count})`);

      backPageButton.setDisableState(this.getCurrentPage() === 1);

      this.pageCount.subscribe((pageCount) =>
        nextPageButton.setDisableState(this.getCurrentPage() === pageCount),
      );
    });
  }

  getCarCount() {
    return this.carCount.getValue();
  }

  reduceCarCount() {
    this.carCount.notify((count) => count + 1);
  }

  increaseCarCount() {
    this.carCount.notify((count) => count - 1);
  }

  getCurrentPage() {
    return this.pageNumber.getValue();
  }

  subscribeCurrentPage(pageHeading: BaseComponent) {
    this.pageNumber.subscribe((page) => {
      pageHeading.setTextContent(`Page #${page}`);
    });
    this.pageNumber.notify(this.getCurrentPage());
  }

  reduceCurrentPage() {
    this.pageNumber.notify((prev) => {
      if (prev > 1) {
        return prev - 1;
      }
      return prev;
    });
  }

  increaseCurrentPage() {
    this.pageNumber.notify((prev) => {
      if (prev < this.pageCount.getValue()) {
        return prev + 1;
      }
      return prev;
    });
  }

  getPageCount() {
    return this.pageCount.getValue();
  }

  updatePageCount(num: number) {
    this.pageCount.notify(num);
  }

  subscribeFormValues(callback: (formValues: FormValues) => void) {
    this.formValues.subscribe(callback);
    this.formValues.notify(this.formValues.getValue());
  }

  setTextValue(value: string) {
    this.formValues.notify((formValues) => {
      // eslint-disable-next-line no-param-reassign
      formValues.text = value;
      return formValues;
    });
  }

  setColorValue(value: string) {
    this.formValues.notify((formValues) => {
      // eslint-disable-next-line no-param-reassign
      formValues.color = value;
      return formValues;
    });
  }

  subscribeDisableRaceButton(button: Button) {
    this.isDisableRaceButton.subscribe((isDisable) => button.setDisableState(isDisable));
    this.isDisableRaceButton.notify(false);
  }

  disableRaceButton() {
    this.isDisableRaceButton.notify(true);
  }

  enableRaceButton() {
    this.isDisableRaceButton.notify(false);
  }
}

export const garageService = new GarageService();
