import './header.scss';
import { AppRoute } from '../../enums/app-route';
import { Router } from '../../router/router';
import { BaseComponent } from '../base-component';
import { Button } from '../button/button';

export class Header extends BaseComponent {
  constructor(router: Router) {
    super({ tagName: 'header', classNames: 'header' });

    const gameName = new BaseComponent({
      tagName: 'h1',
      textContent: 'Async Race',
      classNames: 'name-game',
    });

    const buttonsContainer = new BaseComponent({ tagName: 'div', classNames: 'button-container' });

    const garageButton = new Button({ textContent: 'GARAGE', classNames: 'button_garage' }, () =>
      router.navigate(AppRoute.Garage),
    );

    const winnersButton = new Button({ textContent: 'WINNERS', classNames: 'button_winners' }, () =>
      router.navigate(AppRoute.Winners),
    );
    buttonsContainer.insertChildren([garageButton, winnersButton]);

    this.insertChildren([gameName, buttonsContainer]);
  }
}
