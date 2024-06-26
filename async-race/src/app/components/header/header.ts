import './header.scss';
import { AppRoute } from 'Enums/app-route';
import { BaseComponent } from 'Components/base-component';
import { Link } from 'Components/link/link';
import { localStorageService } from 'Services/storage-service';

export class Header extends BaseComponent {
  private garageButton = new Link(
    { textContent: 'GARAGE', classNames: 'button_garage' },
    AppRoute.Garage,
  );

  private winnersButton = new Link(
    { textContent: 'WINNERS', classNames: 'button_winners' },
    AppRoute.Winners,
  );

  constructor() {
    super({ tagName: 'header', classNames: 'header' });

    const gameName = new BaseComponent({
      tagName: 'h1',
      textContent: 'Async Race',
      classNames: 'name-game',
    });

    const buttonsContainer = new BaseComponent({ tagName: 'div', classNames: 'button-container' });
    this.setDisableStateButtons();

    this.garageButton.setOnClick(() => {
      this.setDisableStateButtons();
    });

    this.winnersButton.setOnClick(() => {
      this.setDisableStateButtons();
    });

    buttonsContainer.insertChildren([this.garageButton, this.winnersButton]);

    this.insertChildren([gameName, buttonsContainer]);
  }

  setDisableStateButtons() {
    this.garageButton.setDisableState(localStorageService.getData('openPage') === 'garage');
    this.winnersButton.setDisableState(localStorageService.getData('openPage') === 'winners');
  }
}
