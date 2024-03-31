import './header.scss';
import { AppRoute } from '../../enums/app-route';
import { BaseComponent } from '../base-component';
import { Link } from '../link/link';
import { Observable } from '../../services/observable';

export class Header extends BaseComponent {
  private isGaragePageOpen = new Observable<boolean>(true);

  constructor() {
    super({ tagName: 'header', classNames: 'header' });

    const gameName = new BaseComponent({
      tagName: 'h1',
      textContent: 'Async Race',
      classNames: 'name-game',
    });

    const buttonsContainer = new BaseComponent({ tagName: 'div', classNames: 'button-container' });

    const garageButton = new Link(
      { textContent: 'GARAGE', classNames: 'button_garage' },
      AppRoute.Garage,
    );
    garageButton.setDisableState(true);

    garageButton.setOnClick(() => this.isGaragePageOpen.notify(true));

    const winnersButton = new Link(
      { textContent: 'WINNERS', classNames: 'button_winners' },
      AppRoute.Winners,
    );

    winnersButton.setOnClick(() => this.isGaragePageOpen.notify(false));

    this.isGaragePageOpen.subscribe((isOpen) => {
      garageButton.setDisableState(isOpen);
      winnersButton.setDisableState(!isOpen);
    });

    buttonsContainer.insertChildren([garageButton, winnersButton]);

    this.insertChildren([gameName, buttonsContainer]);
  }
}
