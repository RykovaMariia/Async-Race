import './header.scss';
import { AppRoute } from '../../enums/app-route';
import { BaseComponent } from '../base-component';
import { Link } from '../link/link';

export class Header extends BaseComponent {
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

    const winnersButton = new Link(
      { textContent: 'WINNERS', classNames: 'button_winners' },
      AppRoute.Winners,
    );

    buttonsContainer.insertChildren([garageButton, winnersButton]);

    this.insertChildren([gameName, buttonsContainer]);
  }
}
